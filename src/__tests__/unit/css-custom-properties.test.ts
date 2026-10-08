import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

/**
 * On 2026-10-02, `--surface-muted` sent the article topic pill to a navy fallback in light
 * mode: the property was defined nowhere, so the legacy fallback colour won. A custom
 * property referenced in a stylesheet must be defined either globally (a non-module
 * stylesheet such as `variables.css`, a `:global(…)` rule inside a module, a registered
 * `@property`, or a key of a React `style={{ … }}` object) or locally in the same
 * stylesheet. A declaration inside another component's module does not count: that is
 * exactly how `--surface-muted` looked "defined" (`.hero` in the article page module) while
 * every other file fell through to its fallback.
 *
 * Known limits, by design: this is a name inventory, not a computed-value check. It does
 * not see selector scope (a property set in `.hero` and read in `.card` of the same file
 * passes), nor which theme block defines a name, nor `element.style.setProperty(…)` from
 * TS; declare such a property with a `style={{ '--name': … }}` key or in `variables.css`.
 */
function walk(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name)
		return entry.isDirectory() ? walk(path) : [path]
	})
}

// Keep newlines intact so diagnostics point to the original source lines.
function withoutCssComments(source: string): string {
	return source.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\r\n]/g, ' '))
}

/** The source text of every `style={ … }` attribute value, with balanced braces. */
function styleObjects(source: string): string[] {
	const objects: string[] = []
	for (const match of source.matchAll(/style=\{/g)) {
		let depth = 0
		for (let index = match.index + 'style='.length; index < source.length; index += 1) {
			const char = source[index]
			if (char === '{') depth += 1
			if (char === '}') depth -= 1
			if (depth === 0) {
				objects.push(source.slice(match.index, index + 1))
				break
			}
		}
	}
	return objects
}

type Inventory = {
	globalDefinitions: Set<string>
	/** Custom properties declared in a `.module.css`, with the file that declares them. */
	moduleDefinitions: Map<string, Set<string>>
	/** Every `var(--name)` read, with `file:line` locations. */
	references: Map<string, Set<string>>
	/** Names read outside the module that defines them (or in non-module CSS). */
	unresolved: Map<string, Set<string>>
}

function inventory(root: string): Inventory {
	const files = walk(resolve(root, 'src')).sort()
	const globalDefinitions = new Set<string>()
	const moduleDefinitions = new Map<string, Set<string>>()
	const references = new Map<string, Set<string>>()
	const unresolved = new Map<string, Set<string>>()
	const add = (map: Map<string, Set<string>>, key: string, value: string) => {
		const values = map.get(key) ?? new Set<string>()
		values.add(value)
		map.set(key, values)
	}

	for (const file of files) {
		if (!/\.(css|tsx?)$/.test(file)) continue
		const source = readFileSync(file, 'utf8')
		const location = relative(root, file).replace(/\\/g, '/')
		if (!file.endsWith('.css')) {
			// Only keys of a React `style={ … }` object count: a quoted `--name` elsewhere (a
			// comment, a test string, an unused constant) must not mask an undefined token.
			for (const object of styleObjects(source)) {
				for (const match of object.matchAll(/(['"`])(--[\w-]+)\1\s*\]?\s*:/g)) {
					globalDefinitions.add(match[2])
				}
			}
			continue
		}

		const css = withoutCssComments(source)
		const isModule = file.endsWith('.module.css')
		const localDefinitions = new Set<string>()
		for (const match of css.matchAll(/(--[\w-]+)\s*:/g)) {
			if (isModule) {
				localDefinitions.add(match[1])
				add(moduleDefinitions, match[1], location)
			} else {
				globalDefinitions.add(match[1])
			}
		}
		// Declarations inside a `:global(…) { … }` rule of a module reach the whole document.
		for (const rule of css.matchAll(/:global\([^)]*\)[^{]*\{([^}]*)\}/g)) {
			for (const match of rule[1].matchAll(/(--[\w-]+)\s*:/g)) {
				globalDefinitions.add(match[1])
			}
		}
		// Registered properties (`@property --name`) are definitions too.
		for (const match of css.matchAll(/@property\s+(--[\w-]+)/g)) {
			globalDefinitions.add(match[1])
		}

		// Global matching also visits var() calls nested inside fallback values.
		for (const match of css.matchAll(/\bvar\(\s*(--[\w-]+)/gi)) {
			const name = match[1]
			const line = css.slice(0, match.index).split('\n').length
			add(references, name, `${location}:${line}`)
			if (!localDefinitions.has(name)) add(unresolved, name, `${location}:${line}`)
		}
	}

	return { globalDefinitions, moduleDefinitions, references, unresolved }
}

function describeLocations(locations: Iterable<string>): string {
	return [...locations]
		.sort((a, b) => {
			const [aFile, aLine] = [
				a.slice(0, a.lastIndexOf(':')),
				Number(a.slice(a.lastIndexOf(':') + 1)),
			]
			const [bFile, bLine] = [
				b.slice(0, b.lastIndexOf(':')),
				Number(b.slice(b.lastIndexOf(':') + 1)),
			]
			return aFile < bFile ? -1 : aFile > bFile ? 1 : aLine - bLine
		})
		.map((location) => `  ${location}`)
		.join('\n')
}

describe('css custom properties', () => {
	const result = inventory(process.cwd())

	it('defines every custom property referenced by source CSS, globally or in the same file', () => {
		const undefinedNames = [...result.unresolved.keys()]
			.filter((name) => !result.globalDefinitions.has(name))
			.sort()
		const diagnostics = undefinedNames.map(
			(name) => `${name}\n${describeLocations(result.unresolved.get(name)!)}`,
		)

		expect(
			undefinedNames,
			`Undefined CSS custom properties (${undefinedNames.length}):\n${diagnostics.join('\n')}`,
		).toEqual([])
	})

	it('reads every custom property that a module declares', () => {
		// The other direction of the same contract: a module that sets `--button-foreground`
		// for a Button it contains relies on Button.module.css still reading that name. A
		// renamed consumer would otherwise fail silently, in one theme, on one page.
		const unread = [...result.moduleDefinitions.keys()]
			.filter((name) => !result.references.has(name))
			.sort()
		const diagnostics = unread.map(
			(name) => `${name}\n${describeLocations(result.moduleDefinitions.get(name)!)}`,
		)

		expect(
			unread,
			`Custom properties declared in a module but read nowhere (${unread.length}):\n${diagnostics.join('\n')}`,
		).toEqual([])
	})
})

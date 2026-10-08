import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { expect, it } from 'vitest'

/**
 * On 2026-10-02, `--surface-muted` sent the article topic pill to a navy fallback in light
 * mode: the property was defined nowhere, so the legacy fallback colour won. A custom
 * property referenced in a stylesheet must be defined either globally (a non-module
 * stylesheet such as `variables.css`, or an inline-style key in TSX) or locally in the same
 * stylesheet. A declaration inside another component's module does not count: that is
 * exactly how `--surface-muted` looked "defined" (`.hero` in the article page module) while
 * every other file fell through to its fallback.
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

it('defines every custom property referenced by source CSS, globally or in the same file', () => {
	const root = process.cwd()
	const files = walk(resolve(root, 'src')).sort()
	const globalDefinitions = new Set<string>()
	const references = new Map<string, Set<string>>()

	for (const file of files) {
		if (!/\.(css|tsx?)$/.test(file)) continue
		const source = readFileSync(file, 'utf8')
		if (!file.endsWith('.css')) {
			// Quoted inline-style keys, including computed template-literal keys.
			for (const match of source.matchAll(/(['"`])(--[\w-]+)\1\s*\]?\s*:/g)) {
				globalDefinitions.add(match[2])
			}
			continue
		}

		const css = withoutCssComments(source)
		const isModule = file.endsWith('.module.css')
		const localDefinitions = new Set<string>()
		for (const match of css.matchAll(/(--[\w-]+)\s*:/g)) {
			;(isModule ? localDefinitions : globalDefinitions).add(match[1])
		}
		// Registered properties (`@property --name`) are definitions too.
		for (const match of css.matchAll(/@property\s+(--[\w-]+)/g)) {
			globalDefinitions.add(match[1])
		}

		// Global matching also visits var() calls nested inside fallback values.
		for (const match of css.matchAll(/\bvar\(\s*(--[\w-]+)/g)) {
			const name = match[1]
			if (localDefinitions.has(name)) continue
			const line = css.slice(0, match.index).split('\n').length
			const location = `${relative(root, file).replace(/\\/g, '/')}:${line}`
			const locations = references.get(name) ?? new Set<string>()
			locations.add(location)
			references.set(name, locations)
		}
	}

	const undefinedNames = [...references.keys()]
		.filter((name) => !globalDefinitions.has(name))
		.sort()
	const diagnostics = undefinedNames.map((name) => {
		const locations = [...references.get(name)!].sort((a, b) => {
			const aColon = a.lastIndexOf(':')
			const bColon = b.lastIndexOf(':')
			const aFile = a.slice(0, aColon)
			const bFile = b.slice(0, bColon)
			return aFile < bFile
				? -1
				: aFile > bFile
					? 1
					: Number(a.slice(aColon + 1)) - Number(b.slice(bColon + 1))
		})
		return `${name}\n${locations.map((location) => `  ${location}`).join('\n')}`
	})

	expect(
		undefinedNames,
		`Undefined CSS custom properties (${undefinedNames.length}):\n${diagnostics.join('\n')}`,
	).toEqual([])
})

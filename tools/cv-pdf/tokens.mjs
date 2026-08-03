import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { repoRoot } from './paths.mjs'

const VARIABLES_CSS = 'src/app/(frontend)/styles/variables.css'

/**
 * Extracts the light-mode semantic tokens from the website's own stylesheet.
 *
 * The PDF must not carry its own palette. AGENTS.md is explicit that a brand
 * application "must not become a parallel component library", so the generator
 * reads the same tokens the site renders instead of restating hex values.
 *
 * Dark-mode blocks are deliberately skipped: brand guidelines §10.2 states that
 * print uses the light palette with canonical teal #0A6E80, and that the
 * dark-mode cyan is a dark-surface expression, not a print colour.
 */
export async function loadLightTokens() {
	const raw = await readFile(resolve(repoRoot, VARIABLES_CSS), 'utf8')

	// Comments are stripped first: the stylesheet has doc comments sitting
	// between a closing brace and the next :root, which trips up naive matching.
	let css = raw.replace(/\/\*[\s\S]*?\*\//g, '')

	// Drop dark-mode declarations entirely rather than trying to skip them
	// during collection — a stray dark value in a print PDF is a brand defect.
	css = dropBlocks(css, /@media[^{]*prefers-color-scheme:\s*dark[^{]*\{/g)
	css = dropBlocks(css, /\[data-theme=['"]?dark['"]?\]\s*[^{]*\{/g)

	const declarations = new Map()

	// Later blocks override earlier ones, which is what we want: the base :root
	// lands first and the 1280px tier overwrites the type scale. A fixed A4 page
	// should use the widest tier, not the compact mobile defaults.
	for (const match of css.matchAll(/:root\s*\{([^{}]*)\}/g)) {
		for (const declaration of match[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
			declarations.set(declaration[1], declaration[2].trim())
		}
	}

	if (!declarations.has('--action-primary')) {
		throw new Error(
			`Could not read semantic tokens from ${VARIABLES_CSS}. ` +
				'The generator refuses to fall back to hardcoded colours.',
		)
	}

	return declarations
}

/** Removes a whole at-rule or selector block, matching braces so nesting works. */
function dropBlocks(css, selector) {
	let result = css
	for (;;) {
		selector.lastIndex = 0
		const match = selector.exec(result)
		if (!match) return result

		let depth = 1
		let index = match.index + match[0].length
		while (index < result.length && depth > 0) {
			if (result[index] === '{') depth += 1
			else if (result[index] === '}') depth -= 1
			index += 1
		}
		result = result.slice(0, match.index) + result.slice(index)
	}
}

export function tokensToCss(declarations) {
	const lines = [...declarations].map(([name, value]) => `\t${name}: ${value};`)
	return `:root {\n${lines.join('\n')}\n}`
}

/** Resolves var() chains so the value can be asserted in tests. */
export function resolveToken(declarations, name, seen = new Set()) {
	if (seen.has(name)) throw new Error(`Circular token reference at ${name}`)
	seen.add(name)

	const value = declarations.get(name)
	if (value === undefined) return undefined

	const reference = value.match(/^var\((--[\w-]+)\)$/)
	return reference ? resolveToken(declarations, reference[1], seen) : value
}

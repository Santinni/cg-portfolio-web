import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { loadLightTokens, resolveToken } from '../../../tools/cv-pdf/tokens.mjs'

const printCssPath = resolve(process.cwd(), 'tools/cv-pdf/cv-print.css')

/**
 * The CV PDF must stay bound to the design system rather than growing its own
 * palette. These tests fail loudly if that link is broken.
 */
describe('cv pdf design tokens', () => {
	it('resolves the canonical brand teal for print', async () => {
		const tokens = await loadLightTokens()

		// Brand guidelines §10.2: print uses #0A6E80 and never the dark-mode cyan.
		expect(resolveToken(tokens, '--action-primary')?.toLowerCase()).toBe('#0a6e80')
		expect(resolveToken(tokens, '--surface-page')?.toLowerCase()).toBe('#ffffff')
		expect(resolveToken(tokens, '--text-primary')?.toLowerCase()).toBe('#08090c')
	})

	it('does not pick up dark-theme overrides', async () => {
		const tokens = await loadLightTokens()

		// The dark theme redefines these; the light values must survive parsing.
		expect(resolveToken(tokens, '--surface-page')?.toLowerCase()).not.toBe('#08090c')
		expect(resolveToken(tokens, '--text-primary')?.toLowerCase()).not.toBe('#ffffff')
	})

	it('never prints the dark-surface accent', async () => {
		const css = await readFile(printCssPath, 'utf8')

		// --accent-on-contrast resolves to #22D3EE. It is a legitimate light-mode
		// token for dark surfaces, but the CV has none, and brand guidelines §10.2
		// bars the dark-mode cyan from print entirely.
		expect(css).not.toMatch(/--accent-on-contrast|--text-on-contrast|--surface-contrast/)
	})

	it('keeps the print stylesheet free of hardcoded colours', async () => {
		const css = await readFile(printCssPath, 'utf8')
		const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')

		expect(withoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i)
		expect(withoutComments).not.toMatch(/\b(rgb|hsl)a?\(/i)
	})

	it('uses the shared spacing scale rather than arbitrary values', async () => {
		const css = await readFile(printCssPath, 'utf8')
		const spacingTokens = [...css.matchAll(/var\((--space-\d+)\)/g)].map((match) => match[1])

		expect(spacingTokens.length).toBeGreaterThan(0)

		const tokens = await loadLightTokens()
		for (const token of new Set(spacingTokens)) {
			expect(tokens.has(token), `${token} is not defined in variables.css`).toBe(true)
		}
	})
})

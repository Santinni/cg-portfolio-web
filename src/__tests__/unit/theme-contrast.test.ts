import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { loadLightTokens, resolveToken } from '../../../tools/cv-pdf/tokens.mjs'

/**
 * Colour pairs the article chrome relies on, checked in both themes from the token file
 * itself. The pairs are the ones a reviewer cannot eyeball in a diff: topic tags on the
 * contrast hero, their hover state, and the four status accents used by callouts.
 * WCAG 2.x contrast; 4.5:1 for text, 3:1 for the non-text callout accent bar.
 */
const variablesPath = resolve(process.cwd(), 'src/app/(frontend)/styles/variables.css')

type Tokens = Map<string, string>

async function loadDarkTokens(): Promise<Tokens> {
	const css = await readFile(variablesPath, 'utf8')
	const block = css.match(/:root\[data-theme=['"]dark['"]\]\s*\{([\s\S]*?)\n\}/)
	expect(block, 'dark theme block in variables.css').not.toBeNull()
	const dark: Tokens = new Map(await loadLightTokens())
	for (const match of block![1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
		dark.set(match[1], match[2].trim())
	}
	return dark
}

function hexToRgb(hex: string): [number, number, number] {
	const value = hex.replace('#', '')
	const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value
	const n = Number.parseInt(full, 16)
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function luminance(hex: string): number {
	const [r, g, b] = hexToRgb(hex).map((channel) => {
		const c = channel / 255
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
	})
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(foreground: string, background: string): number {
	const [l1, l2] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
	return (l1 + 0.05) / (l2 + 0.05)
}

function colour(tokens: Tokens, name: string): string {
	const value = resolveToken(tokens, name)
	expect(value, `${name} resolves to a hex colour`).toMatch(/^#[0-9a-f]{6}$/i)
	return value as string
}

describe.each([
	['light', loadLightTokens],
	['dark', loadDarkTokens],
] as const)('%s theme contrast', (_theme, load) => {
	it('keeps topic tags readable on the article hero, at rest and on hover', async () => {
		const tokens = await load()
		const hero = colour(tokens, '--surface-contrast')

		expect(contrast(colour(tokens, '--accent-on-contrast'), hero)).toBeGreaterThanOrEqual(4.5)
		expect(
			contrast(colour(tokens, '--surface-contrast'), colour(tokens, '--text-on-contrast-muted')),
		).toBeGreaterThanOrEqual(4.5)
	})

	it('keeps the status accents visible on raised and page surfaces', async () => {
		const tokens = await load()
		for (const status of [
			'--status-info',
			'--status-success',
			'--status-warning',
			'--status-danger',
		]) {
			for (const surface of ['--surface-raised', '--surface-page']) {
				expect(
					contrast(colour(tokens, status), colour(tokens, surface)),
					`${status} on ${surface}`,
				).toBeGreaterThanOrEqual(3)
			}
		}
	})

	it('keeps quiet button text readable where topic tags render outside the hero', async () => {
		const tokens = await load()
		expect(
			contrast(colour(tokens, '--action-primary'), colour(tokens, '--surface-raised')),
		).toBeGreaterThanOrEqual(4.5)
		expect(
			contrast(colour(tokens, '--action-primary'), colour(tokens, '--surface-subtle')),
		).toBeGreaterThanOrEqual(4.5)
	})
})

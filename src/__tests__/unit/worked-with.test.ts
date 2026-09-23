import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { workedWith } from '@/content/workedWith'

describe('worked with row content (HP-04)', () => {
	it('points every mark at a file in public/ with a usable ratio and a name', () => {
		for (const company of workedWith) {
			expect(company.src, company.key).toMatch(/^\/[a-z0-9-]+\.svg$/)
			expect(existsSync(resolve('public', company.src.slice(1))), company.src).toBe(true)
			expect(company.width, company.key).toBeGreaterThan(0)
			expect(company.height, company.key).toBeGreaterThan(0)
			expect(company.name.trim(), company.key).not.toBe('')
			// Optical correction stays inside the approved clamp (HP-04, 2026-09-23).
			expect(company.scale, company.key).toBeGreaterThanOrEqual(0.72)
			expect(company.scale, company.key).toBeLessThanOrEqual(1.35)
		}
	})

	it('keeps each mark file viewBox in step with the content model box', () => {
		// The rendered width comes from `aspect-ratio: width / height`; a file whose viewBox is
		// cropped (mnd.svg, 2026-09-23) or replaced must update the model, or the mask distorts.
		for (const company of workedWith) {
			const svg = readFileSync(resolve('public', company.src.slice(1)), 'utf8')
			const viewBox = svg
				.match(/viewBox="([^"]+)"/)?.[1]
				.split(/\s+/)
				.map(Number)
			const ratio = viewBox
				? viewBox[2] / viewBox[3]
				: Number(svg.match(/width="([\d.]+)"/)?.[1]) / Number(svg.match(/height="([\d.]+)"/)?.[1])
			expect(ratio, company.key).toBeCloseTo(company.width / company.height, 2)
		}
	})

	it('keeps keys unique and the current client first', () => {
		const keys = workedWith.map(({ key }) => key)
		expect(new Set(keys).size).toBe(keys.length)
		expect(keys[0]).toBe('nkp')
		expect(keys).toHaveLength(7)
	})
})

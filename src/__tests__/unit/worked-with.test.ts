import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { workedWith } from '@/content/workedWith'

describe('worked with row content (HP-04)', () => {
	it('gives every mark a generated logo component, a source file and a name', () => {
		for (const company of workedWith) {
			expect(company.Logo.displayName, company.key).toMatch(/LogoSvg$/)
			// The component is generated from this file by `pnpm icons:generate`.
			const source = resolve('src/assets/logos', `${company.key}.svg`)
			expect(existsSync(source), source).toBe(true)
			expect(company.name.trim(), company.key).not.toBe('')
			// Optical correction stays inside the approved clamp (HP-04, 2026-09-23).
			expect(company.scale, company.key).toBeGreaterThanOrEqual(0.72)
			expect(company.scale, company.key).toBeLessThanOrEqual(1.35)
		}
	})

	it('keeps keys unique and the current client first', () => {
		const keys = workedWith.map(({ key }) => key)
		expect(new Set(keys).size).toBe(keys.length)
		expect(keys[0]).toBe('nkp')
		expect(keys).toHaveLength(7)
	})
})

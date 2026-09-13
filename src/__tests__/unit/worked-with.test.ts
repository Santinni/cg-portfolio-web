import { existsSync } from 'node:fs'
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
		}
	})

	it('keeps keys unique and the current client first', () => {
		const keys = workedWith.map(({ key }) => key)
		expect(new Set(keys).size).toBe(keys.length)
		expect(keys[0]).toBe('nkp')
		expect(keys).toHaveLength(7)
	})
})

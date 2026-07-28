import { describe, expect, it } from 'vitest'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

function collectLeafEntries(value: unknown, prefix = ''): Array<[string, unknown]> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return [[prefix, value]]
	}

	const entries = Object.entries(value)
	if (entries.length === 0) {
		return [[prefix, value]]
	}

	return entries.flatMap(([key, child]) =>
		collectLeafEntries(child, prefix ? `${prefix}.${key}` : key),
	)
}

describe('translation catalogs', () => {
	it('have exact recursive key parity', () => {
		const enKeys = collectLeafEntries(enMessages)
			.map(([key]) => key)
			.sort()
		const csKeys = collectLeafEntries(csMessages)
			.map(([key]) => key)
			.sort()

		expect(enKeys.length).toBeGreaterThan(0)
		expect(csKeys).toEqual(enKeys)
	})

	it.each([
		['en', enMessages],
		['cs', csMessages],
	] as const)('contains only non-empty leaf messages for %s', (_locale, messages) => {
		for (const [key, value] of collectLeafEntries(messages)) {
			expect(typeof value, `${key} must be a string`).toBe('string')
			expect((value as string).trim(), `${key} must not be empty`).not.toBe('')
		}
	})
})

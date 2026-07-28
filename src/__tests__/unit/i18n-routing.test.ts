import { describe, expect, it } from 'vitest'

import { routing } from '@/i18n/routing'

describe('i18n routing contract', () => {
	it('keeps English unprefixed and publishes Czech below /cs', () => {
		expect(routing.locales).toEqual(['en', 'cs'])
		expect(routing.defaultLocale).toBe('en')
		expect(routing.localePrefix).toBe('as-needed')
	})

	it('does not infer locale from cookies or request headers', () => {
		expect(routing.localeDetection).toBe(false)
	})
})

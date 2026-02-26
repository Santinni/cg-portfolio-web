import { describe, expect, it } from 'vitest'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

describe('anyone access function', () => {
	it('returns true for any request', () => {
		expect(anyone({} as never)).toBe(true)
	})
})

describe('authenticated access function', () => {
	it('returns true when user is present', () => {
		const args = { req: { user: { id: '1', email: 'test@test.cz' } } }
		expect(authenticated(args as never)).toBe(true)
	})

	it('returns false when user is null', () => {
		const args = { req: { user: null } }
		expect(authenticated(args as never)).toBe(false)
	})

	it('returns false when user is undefined', () => {
		const args = { req: { user: undefined } }
		expect(authenticated(args as never)).toBe(false)
	})
})

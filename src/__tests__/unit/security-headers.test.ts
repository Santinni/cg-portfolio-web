import { describe, expect, it } from 'vitest'

import {
	buildSecurityHeaders,
	CONTENT_SECURITY_POLICY_DIRECTIVES,
	isPlainHttpOrigin,
	STRICT_TRANSPORT_SECURITY,
} from '@/lib/security/headers'

function header(headers: ReturnType<typeof buildSecurityHeaders>, key: string) {
	return headers.find((entry) => entry.key === key)?.value
}

describe('security headers', () => {
	it('keeps HSTS and upgrade-insecure-requests on the production TLS origin', () => {
		const headers = buildSecurityHeaders({ publicServerUrl: 'https://codeguy.cz' })

		expect(header(headers, 'Strict-Transport-Security')).toBe(STRICT_TRANSPORT_SECURITY)
		expect(header(headers, 'Content-Security-Policy')).toBe(
			[...CONTENT_SECURITY_POLICY_DIRECTIVES, 'upgrade-insecure-requests'].join('; '),
		)
	})

	it.each(['http://localhost:3000', 'http://app:3000', 'http://127.0.0.1:3000'])(
		'omits the TLS-only directives on the plain-HTTP origin %s',
		(publicServerUrl) => {
			const headers = buildSecurityHeaders({ publicServerUrl })

			expect(header(headers, 'Strict-Transport-Security')).toBeUndefined()
			expect(header(headers, 'Content-Security-Policy')).toBe(
				CONTENT_SECURITY_POLICY_DIRECTIVES.join('; '),
			)
			expect(header(headers, 'Content-Security-Policy')).not.toContain('upgrade-insecure-requests')
		},
	)

	it.each([undefined, '', 'codeguy.cz', ' HTTPS://codeguy.cz '])(
		'fails secure and keeps both directives when the origin is %s (not explicitly http)',
		(publicServerUrl) => {
			const headers = buildSecurityHeaders({ publicServerUrl })

			expect(header(headers, 'Strict-Transport-Security')).toBe(STRICT_TRANSPORT_SECURITY)
			expect(header(headers, 'Content-Security-Policy')).toContain('upgrade-insecure-requests')
		},
	)

	it('never drops the origin-independent headers', () => {
		for (const publicServerUrl of ['https://codeguy.cz', 'http://localhost:3000']) {
			const headers = buildSecurityHeaders({ publicServerUrl })

			expect(header(headers, 'X-Frame-Options')).toBe('DENY')
			expect(header(headers, 'X-Content-Type-Options')).toBe('nosniff')
			expect(header(headers, 'Referrer-Policy')).toBe('strict-origin-when-cross-origin')
			expect(header(headers, 'Permissions-Policy')).toContain('camera=()')
			expect(header(headers, 'Content-Security-Policy')).toContain("frame-ancestors 'none'")
			expect(header(headers, 'Content-Security-Policy')).toContain(
				"frame-src 'self' https://calendar.google.com",
			)
		}
	})

	it('recognises only an explicit http scheme as plain HTTP', () => {
		expect(isPlainHttpOrigin('http://localhost:3000')).toBe(true)
		expect(isPlainHttpOrigin(' HTTP://app:3000 ')).toBe(true)
		expect(isPlainHttpOrigin('https://codeguy.cz')).toBe(false)
		expect(isPlainHttpOrigin('codeguy.cz')).toBe(false)
		expect(isPlainHttpOrigin(undefined)).toBe(false)
	})
})

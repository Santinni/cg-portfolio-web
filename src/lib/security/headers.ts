/**
 * Response headers shared by every route.
 *
 * `Strict-Transport-Security` and the CSP `upgrade-insecure-requests` directive only make
 * sense when the site is served over TLS, and they are actively harmful on a plain-HTTP
 * origin: WebKit applies both to `http://localhost` (Chromium and Firefox exempt it), so the
 * pinned multi-engine e2e run upgraded every stylesheet and script to `https://localhost:3000`,
 * hit a server that speaks no TLS, and rendered an unstyled, non-hydrated page.
 *
 * The exemption is deliberately narrow and fails secure: only an origin that explicitly
 * declares `http://` drops the two directives. A missing or malformed value keeps them,
 * because `next.config.ts` evaluates these headers at build time and the production image
 * does not necessarily see `NEXT_PUBLIC_SERVER_URL` during `next build`.
 */

export interface SecurityHeader {
	key: string
	value: string
}

export interface SecurityHeaderOptions {
	/** The public origin the app is served from, e.g. `https://codeguy.cz` or `http://localhost:3000`. */
	publicServerUrl: string | undefined
}

export const CONTENT_SECURITY_POLICY_DIRECTIVES = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' blob: data: https:",
	"font-src 'self' data:",
	"connect-src 'self' https://calendar.google.com",
	"frame-src 'self' https://calendar.google.com",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
] as const

export const STRICT_TRANSPORT_SECURITY = 'max-age=31536000; includeSubDomains; preload'

/** True only for an origin that explicitly declares plain HTTP; anything else is treated as TLS. */
export function isPlainHttpOrigin(publicServerUrl: string | undefined): boolean {
	return typeof publicServerUrl === 'string' && /^http:\/\//i.test(publicServerUrl.trim())
}

export function buildSecurityHeaders({ publicServerUrl }: SecurityHeaderOptions): SecurityHeader[] {
	const tls = !isPlainHttpOrigin(publicServerUrl)
	const directives: string[] = [...CONTENT_SECURITY_POLICY_DIRECTIVES]
	if (tls) directives.push('upgrade-insecure-requests')

	return [
		{ key: 'X-Frame-Options', value: 'DENY' },
		{ key: 'X-Content-Type-Options', value: 'nosniff' },
		{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
		{ key: 'X-DNS-Prefetch-Control', value: 'on' },
		...(tls ? [{ key: 'Strict-Transport-Security', value: STRICT_TRANSPORT_SECURITY }] : []),
		{
			key: 'Permissions-Policy',
			value:
				'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
		},
		{ key: 'Content-Security-Policy', value: directives.join('; ') },
	]
}

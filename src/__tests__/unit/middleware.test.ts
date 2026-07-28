import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/server', () => {
	class MockNextResponse {
		status: number
		body: string | null
		headers: Map<string, string>
		requestHeaders: Headers | null

		constructor(body: string | null, init?: { status?: number; headers?: Record<string, string> }) {
			this.status = init?.status ?? 200
			this.body = body
			this.headers = new Map(Object.entries(init?.headers ?? {}))
			this.requestHeaders = null
		}

		static next(init?: { request?: { headers?: Headers } }) {
			const response = new MockNextResponse(null)
			response.requestHeaders = init?.request?.headers ?? null
			return response
		}
	}

	return { NextResponse: MockNextResponse, NextRequest: vi.fn() }
})

function createMockRequest(pathname: string, ip = '127.0.0.1') {
	return {
		nextUrl: { pathname },
		headers: new Map([['x-forwarded-for', ip]]),
	} as never
}

describe('composed proxy', () => {
	beforeEach(() => {
		vi.resetModules()
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('leaves frontend routing to explicit Next.js rewrites', async () => {
		const { proxy } = await import('@/proxy')
		const response = proxy(createMockRequest('/'))

		expect(response.status).toBe(200)
		expect(response.headers.get('X-RateLimit-Limit')).toBeUndefined()
	})

	it.each(['/cs', '/cs/work'])(
		'injects Czech locale context for %s without a rewrite',
		async (pathname) => {
			const { proxy } = await import('@/proxy')
			const response = proxy(createMockRequest(pathname)) as unknown as {
				headers: Map<string, string>
				requestHeaders: Headers | null
				status: number
			}

			expect(response.status).toBe(200)
			expect(response.headers.get('X-RateLimit-Limit')).toBeUndefined()
			expect(response.requestHeaders?.get('X-NEXT-INTL-LOCALE')).toBe('cs')
		},
	)

	it.each(['/api', '/api/test', '/admin', '/admin/dashboard'])(
		'bypasses localization and rate-limits %s',
		async (pathname) => {
			const { proxy } = await import('@/proxy')
			const response = proxy(createMockRequest(pathname, `10.0.0.${pathname.length}`))

			expect(response.headers.get('X-RateLimit-Limit')).toBe('60')
			expect(response.headers.get('X-RateLimit-Remaining')).toBe('59')
		},
	)

	it('treats /apiary as a frontend route rather than the /api segment', async () => {
		const { proxy } = await import('@/proxy')
		const response = proxy(createMockRequest('/apiary'))

		expect(response.status).toBe(200)
		expect(response.headers.get('X-RateLimit-Limit')).toBeUndefined()
	})

	it('returns 429 after exceeding the existing rate limit', async () => {
		const { proxy } = await import('@/proxy')
		const ip = '10.0.0.30'

		for (let requestNumber = 0; requestNumber < 60; requestNumber++) {
			expect(proxy(createMockRequest('/api/test', ip)).status).toBe(200)
		}

		const response = proxy(createMockRequest('/api/test', ip))

		expect(response.status).toBe(429)
		expect(response.headers.get('Retry-After')).toBe('60')
		expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
	})

	it('matches API, admin and Czech frontend paths', async () => {
		const { config } = await import('@/proxy')

		expect(config.matcher).toEqual(['/api/:path*', '/admin/:path*', '/cs/:path*'])
	})
})

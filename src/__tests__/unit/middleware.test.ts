import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

/**
 * The middleware module uses in-memory state (rateLimitMap).
 * We need to re-import it fresh for each test group to reset state.
 */

// Mock next/server before importing middleware
vi.mock('next/server', () => {
	class MockNextResponse {
		status: number
		body: string | null
		headers: Map<string, string>

		constructor(body: string | null, init?: { status?: number; headers?: Record<string, string> }) {
			this.status = init?.status ?? 200
			this.body = body
			this.headers = new Map(Object.entries(init?.headers ?? {}))
		}

		static next() {
			const response = new MockNextResponse(null)
			response.status = 200
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

describe('middleware', () => {
	beforeEach(() => {
		vi.resetModules()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('passes through non-API/admin routes without rate limiting', async () => {
		const { proxy } = await import('@/proxy')
		const request = createMockRequest('/')
		const response = proxy(request)

		expect(response.status).toBe(200)
	})

	it('allows API requests within rate limit', async () => {
		const { proxy } = await import('@/proxy')
		const request = createMockRequest('/api/test', '10.0.0.1')
		const response = proxy(request)

		expect(response.status).toBe(200)
		expect(response.headers.get('X-RateLimit-Remaining')).toBe('59')
	})

	it('allows admin routes and applies rate limiting', async () => {
		const { proxy } = await import('@/proxy')
		const request = createMockRequest('/admin/dashboard', '10.0.0.2')
		const response = proxy(request)

		expect(response.status).toBe(200)
		expect(response.headers.get('X-RateLimit-Limit')).toBe('60')
	})

	it('returns 429 after exceeding rate limit', async () => {
		const { proxy } = await import('@/proxy')
		const ip = '10.0.0.3'

		// Make 60 requests (the limit)
		for (let i = 0; i < 60; i++) {
			const request = createMockRequest('/api/test', ip)
			const response = proxy(request)
			expect(response.status).toBe(200)
		}

		// 61st request should be rate limited
		const request = createMockRequest('/api/test', ip)
		const response = proxy(request)

		expect(response.status).toBe(429)
		expect(response.headers.get('Retry-After')).toBe('60')
		expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
	})

	it('tracks rate limits per IP independently', async () => {
		const { proxy } = await import('@/proxy')

		// Exhaust rate limit for one IP
		for (let i = 0; i < 61; i++) {
			proxy(createMockRequest('/api/test', '192.168.1.1'))
		}

		// Different IP should still be allowed
		const response = proxy(createMockRequest('/api/test', '192.168.1.2'))
		expect(response.status).toBe(200)
	})

	it('decrements remaining count with each request', async () => {
		const { proxy } = await import('@/proxy')
		const ip = '10.0.0.4'

		const response1 = proxy(createMockRequest('/api/test', ip))
		expect(response1.headers.get('X-RateLimit-Remaining')).toBe('59')

		const response2 = proxy(createMockRequest('/api/test', ip))
		expect(response2.headers.get('X-RateLimit-Remaining')).toBe('58')

		const response3 = proxy(createMockRequest('/api/test', ip))
		expect(response3.headers.get('X-RateLimit-Remaining')).toBe('57')
	})

	it('exports config with correct matcher', async () => {
		const { config } = await import('@/proxy')

		expect(config.matcher).toEqual(['/api/:path*', '/admin/:path*'])
	})
})

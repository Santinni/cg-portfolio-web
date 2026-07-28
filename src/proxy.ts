import { type NextRequest, NextResponse } from 'next/server'

/**
 * Simple in-memory rate limiter for API and admin routes.
 * Uses a sliding window approach with automatic cleanup.
 *
 * Note: This is per-instance; for multi-instance deployments,
 * consider using Redis-based rate limiting instead.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

/** Maximum requests per window */
const RATE_LIMIT_MAX = 60

/** Time window in milliseconds (1 minute) */
const RATE_LIMIT_WINDOW = 60_000

/** Cleanup interval — remove expired entries every 5 minutes */
const CLEANUP_INTERVAL = 300_000

let lastCleanup = Date.now()

/**
 * Extracts the client IP address from the request headers.
 * Falls back to 'unknown' if no identifiable IP is found.
 */
function getClientIp(request: NextRequest): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip') ||
		'unknown'
	)
}

/**
 * Checks if a given IP has exceeded the rate limit.
 * Returns remaining requests count or -1 if limit exceeded.
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
	const now = Date.now()
	const entry = rateLimitMap.get(ip)

	// Periodic cleanup of expired entries
	if (now - lastCleanup > CLEANUP_INTERVAL) {
		lastCleanup = now
		for (const [key, value] of rateLimitMap) {
			if (now > value.resetTime) {
				rateLimitMap.delete(key)
			}
		}
	}

	if (!entry || now > entry.resetTime) {
		rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
		return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
	}

	entry.count++

	if (entry.count > RATE_LIMIT_MAX) {
		return { allowed: false, remaining: 0 }
	}

	return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count }
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Only rate-limit API and admin routes
	if (!pathname.startsWith('/api') && !pathname.startsWith('/admin')) {
		return NextResponse.next()
	}

	const ip = getClientIp(request)
	const { allowed, remaining } = checkRateLimit(ip)

	if (!allowed) {
		return new NextResponse(
			JSON.stringify({ error: 'Too many requests. Please try again later.' }),
			{
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '60',
					'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
					'X-RateLimit-Remaining': '0',
				},
			}
		)
	}

	const response = NextResponse.next()
	response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX))
	response.headers.set('X-RateLimit-Remaining', String(remaining))

	return response
}

export const config = {
	matcher: ['/api/:path*', '/admin/:path*'],
}

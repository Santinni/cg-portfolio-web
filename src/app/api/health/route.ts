import { NextResponse } from 'next/server'

/**
 * Health check endpoint for load balancers and monitoring.
 * Returns 200 OK when the application is running.
 */
export function GET() {
	return NextResponse.json(
		{
			status: 'ok',
			revision: process.env.APP_REVISION || 'development',
			timestamp: new Date().toISOString(),
		},
		{
			status: 200,
			headers: { 'Cache-Control': 'no-store' },
		}
	)
}

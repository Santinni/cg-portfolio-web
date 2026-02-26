import { NextResponse } from 'next/server'

/**
 * Health check endpoint for load balancers and monitoring.
 * Returns 200 OK when the application is running.
 */
export function GET() {
	return NextResponse.json(
		{
			status: 'ok',
			timestamp: new Date().toISOString(),
		},
		{ status: 200 }
	)
}

import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/payload/payloadClient'

const responseHeaders = { 'Cache-Control': 'no-store' }

/**
 * Health check endpoint for load balancers and monitoring.
 * The default check is intentionally shallow for container liveness. `deep=1`
 * also proves that Payload can connect and that committed migrations ran.
 */
export async function GET(request: Request) {
	const revision = process.env.APP_REVISION || 'development'
	const timestamp = new Date().toISOString()
	const deep = new URL(request.url).searchParams.get('deep') === '1'

	if (deep) {
		try {
			const payload = await getPayloadClient()
			await payload.count({ collection: 'users', overrideAccess: true })
		} catch {
			return NextResponse.json(
				{
					status: 'unavailable',
					revision,
					timestamp,
					checks: { database: 'unavailable' },
				},
				{ status: 503, headers: responseHeaders }
			)
		}
	}

	return NextResponse.json(
		{
			status: 'ok',
			revision,
			timestamp,
			checks: { database: deep ? 'ok' : 'skipped' },
		},
		{
			status: 200,
			headers: responseHeaders,
		}
	)
}

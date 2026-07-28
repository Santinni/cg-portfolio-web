import { cache } from 'react'

import { getPayloadClient } from '@/payload/payloadClient'

/**
 * Fetches all home page data using Payload Local API.
 * Wrapped with React.cache() for request-level deduplication.
 * Revalidation is handled at the page/route segment level.
 *
 * @returns Object containing services array, about data, and contact data.
 * @throws Error if critical data (about, contact) is missing from the CMS.
 */
export const getHomePageData = cache(async () => {
	const payload = await getPayloadClient()

	try {
		const [services, about, contact] = await Promise.all([
			payload.find({
				collection: 'services',
				depth: 1,
			}),
			payload.find({
				collection: 'about',
				depth: 1,
				limit: 1,
			}),
			payload.find({
				collection: 'contact',
				depth: 1,
				limit: 1,
			}),
		])

		const aboutData = about.docs[0]
		const contactData = contact.docs[0]

		if (!aboutData || !contactData) {
			throw new Error(
				'Missing required CMS data: ' +
					(!aboutData ? 'About ' : '') +
					(!contactData ? 'Contact' : ''),
			)
		}

		return {
			services: services.docs,
			about: aboutData,
			contact: contactData,
		}
	} catch (error) {
		console.error('Failed to fetch home page data:', error)
		throw new Error('Unable to load page data. Please try again later.', { cause: error })
	}
})

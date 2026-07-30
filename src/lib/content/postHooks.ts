import type { CollectionBeforeChangeHook } from 'payload'

import { asEditorialUser, canPublish, getRelationshipID, isAdmin } from '../auth/roles.ts'
import { calculateReadingTime } from './readingTime.ts'
import { assertPublishedPostIsComplete, validateStableSlug } from './validation.ts'

export const preparePost: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
	const user = asEditorialUser(req.user)

	// firstPublishedAt is a server-owned immutable marker. Never trust a value
	// supplied by the REST/GraphQL/admin client.
	if (originalDoc?.firstPublishedAt) {
		data.firstPublishedAt = originalDoc.firstPublishedAt
	} else {
		delete data.firstPublishedAt
	}

	const authorID = getRelationshipID(user?.author)
	if (user?.role === 'author') {
		if (!authorID) throw new Error('Author users must be linked to an author profile.')
		data.author = authorID
	}

	const merged = { ...(originalDoc ?? {}), ...data }
	const previousStatus = originalDoc?._status
	const nextStatus = merged._status
	const publishingStateChanged = nextStatus !== undefined && previousStatus !== nextStatus
	const publishedAtChanged =
		data.publishedAt !== undefined && data.publishedAt !== originalDoc?.publishedAt

	validateStableSlug(data.slug, originalDoc, isAdmin(user))

	// Anonymous requests cannot reach this hook through collection access. Allowing a
	// missing user keeps Payload's trusted scheduled-publish job operational.
	if (user && (publishingStateChanged || publishedAtChanged) && !canPublish(user)) {
		throw new Error('Only publishers and administrators can publish, unpublish, or schedule posts.')
	}

	if (nextStatus === 'published' && !merged.publishedAt) {
		data.publishedAt = new Date().toISOString()
		merged.publishedAt = data.publishedAt
	}

	if (nextStatus === 'published' && !merged.firstPublishedAt) {
		const firstPublishedAt = merged.publishedAt || new Date().toISOString()
		data.firstPublishedAt = firstPublishedAt
		merged.firstPublishedAt = firstPublishedAt
	}

	data.readingTime = calculateReadingTime(merged.content)
	merged.readingTime = data.readingTime
	assertPublishedPostIsComplete(merged)

	return data
}

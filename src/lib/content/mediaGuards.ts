import type { CollectionBeforeDeleteHook } from 'payload'

export const ALLOWED_MEDIA_MIME_TYPES = [
	'image/avif',
	'image/jpeg',
	'image/png',
	'image/webp',
] as const

export const MAX_MEDIA_FILE_SIZE = 10 * 1024 * 1024
export const MAX_MEDIA_INPUT_PIXELS = 40_000_000

type UploadFile = {
	mimetype?: string | null
	size?: number | null
}

export function assertMediaUploadIsAllowed(file?: UploadFile | null): void {
	if (!file) return

	if (
		file.mimetype &&
		!ALLOWED_MEDIA_MIME_TYPES.includes(file.mimetype as (typeof ALLOWED_MEDIA_MIME_TYPES)[number])
	) {
		throw new Error('Only AVIF, JPEG, PNG and WebP images can be uploaded.')
	}

	if (typeof file.size === 'number' && file.size > MAX_MEDIA_FILE_SIZE) {
		throw new Error('Media files must not exceed 10 MB.')
	}
}

function relationshipMatches(value: unknown, id: number | string): boolean {
	if (value === id || String(value) === String(id)) return true
	if (!value || typeof value !== 'object' || !('id' in value)) return false
	return String((value as { id: unknown }).id) === String(id)
}

export function containsLexicalMediaReference(value: unknown, id: number | string): boolean {
	if (Array.isArray(value)) {
		return value.some((item) => containsLexicalMediaReference(item, id))
	}

	if (!value || typeof value !== 'object') return false

	const node = value as Record<string, unknown>
	if (
		node.type === 'upload' &&
		node.relationTo === 'media' &&
		relationshipMatches(node.value, id)
	) {
		return true
	}

	return Object.values(node).some((item) => containsLexicalMediaReference(item, id))
}

export const preventReferencedMediaDeletion: CollectionBeforeDeleteHook = async ({ id, req }) => {
	const [about, projects, authors, posts] = await Promise.all([
		req.payload.find({
			collection: 'about',
			depth: 0,
			overrideAccess: true,
			pagination: false,
			req,
		}),
		req.payload.find({
			collection: 'projects',
			depth: 0,
			overrideAccess: true,
			pagination: false,
			req,
		}),
		req.payload.find({
			collection: 'authors',
			depth: 0,
			overrideAccess: true,
			pagination: false,
			req,
		}),
		req.payload.find({
			collection: 'posts',
			depth: 0,
			draft: true,
			overrideAccess: true,
			pagination: false,
			req,
		}),
	])

	const explicitlyReferenced =
		about.docs.some((doc) => relationshipMatches(doc.image, id)) ||
		projects.docs.some((doc) => relationshipMatches(doc.image, id)) ||
		authors.docs.some((doc) => relationshipMatches(doc.portrait, id)) ||
		posts.docs.some(
			(doc) =>
				relationshipMatches(doc.featuredImage, id) ||
				relationshipMatches(doc.socialImage, id) ||
				relationshipMatches(doc.meta?.image, id) ||
				containsLexicalMediaReference(doc.content, id),
		)

	if (explicitlyReferenced) {
		throw new Error(
			'This media item is still referenced by content. Remove every reference before deleting it.',
		)
	}
}

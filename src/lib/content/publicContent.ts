import type { Where } from 'payload'

import type { Author, Media, Post, Topic } from '../../payload-types'

export type PublicMedia = Pick<
	Media,
	'alt' | 'caption' | 'credit' | 'decorative' | 'height' | 'id' | 'sizes' | 'url' | 'width'
>
export type PublicAuthor = Pick<
	Author,
	'biography' | 'expertise' | 'id' | 'name' | 'role' | 'socialLinks'
> & {
	portrait: PublicMedia | null
}
export type PublicTopic = Pick<Topic, 'description' | 'id' | 'label' | 'order' | 'slug'>

export type PublicPost = Pick<
	Post,
	| 'canonicalURL'
	| 'content'
	| 'excerpt'
	| 'featured'
	| 'id'
	| 'noIndex'
	| 'publishedAt'
	| 'readingTime'
	| 'slug'
	| 'socialDescription'
	| 'socialTitle'
	| 'title'
	| 'updatedAt'
> & {
	author: PublicAuthor
	featuredImage: PublicMedia
	meta?: {
		description?: string | null
		image: PublicMedia | null
		title?: string | null
	}
	relatedPostIDs: Array<number | string>
	socialImage: PublicMedia | null
	topics: PublicTopic[]
}

export type PublishedPostQuery = {
	excludeNoIndex?: boolean
	slug?: string
	topicSlug?: string
}

export const buildPublishedPostWhere = ({
	excludeNoIndex = false,
	slug,
	topicSlug,
}: PublishedPostQuery = {}): Where => {
	const where: Where = { _status: { equals: 'published' } }
	if (slug) where.slug = { equals: slug }
	if (topicSlug) where['topics.slug'] = { equals: topicSlug }
	if (excludeNoIndex) where.noIndex = { not_equals: true }
	return where
}

export const normalizePagination = ({
	limit = 12,
	page = 1,
}: {
	limit?: number
	page?: number
} = {}): { limit: number; page: number } => ({
	limit: Math.min(24, Math.max(1, Math.trunc(Number.isFinite(limit) ? limit : 12))),
	page: Math.max(1, Math.trunc(Number.isFinite(page) ? page : 1)),
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
	Boolean(value && typeof value === 'object')

const isAuthor = (value: Author | number | null | undefined): value is Author =>
	isRecord(value) && typeof value.id !== 'undefined' && typeof value.name === 'string'

const isTopic = (value: number | Topic): value is Topic =>
	isRecord(value) && typeof value.id !== 'undefined' && typeof value.slug === 'string'

const isMedia = (value: Media | number | null | undefined): value is Media =>
	isRecord(value) && typeof value.id !== 'undefined' && typeof value.decorative === 'boolean'

export const mapPublicMedia = (media: Media | number | null | undefined): PublicMedia | null => {
	if (!isMedia(media)) return null
	return {
		alt: media.alt,
		caption: media.caption,
		credit: media.credit,
		decorative: media.decorative,
		height: media.height,
		id: media.id,
		sizes: media.sizes,
		url: media.url,
		width: media.width,
	}
}

export const mapPublicAuthor = (
	author: Author | number | null | undefined,
): PublicAuthor | null => {
	if (!isAuthor(author)) return null
	return {
		biography: author.biography,
		expertise: author.expertise,
		id: author.id,
		name: author.name,
		portrait: mapPublicMedia(author.portrait),
		role: author.role,
		socialLinks: author.socialLinks
			? {
					github: author.socialLinks.github,
					linkedin: author.socialLinks.linkedin,
					website: author.socialLinks.website,
				}
			: undefined,
	}
}

export const mapPublicTopic = (topic: Topic | number): PublicTopic | null => {
	if (!isTopic(topic)) return null
	return {
		description: topic.description,
		id: topic.id,
		label: topic.label,
		order: topic.order,
		slug: topic.slug,
	}
}

export const mapPublicPost = (post: Post): PublicPost | null => {
	if (post._status !== 'published') return null
	const author = mapPublicAuthor(post.author)
	const featuredImage = mapPublicMedia(post.featuredImage)
	const topics = post.topics.map(mapPublicTopic)
	if (!author || !featuredImage || topics.some((topic) => topic === null)) return null

	const relatedPostIDs = (post.relatedPosts ?? [])
		.filter((related): related is Post => isRecord(related) && related._status === 'published')
		.map((related) => related.id)

	return {
		author,
		canonicalURL: post.canonicalURL,
		content: post.content,
		excerpt: post.excerpt,
		featured: post.featured,
		featuredImage,
		id: post.id,
		meta: post.meta
			? {
					description: post.meta.description,
					image: mapPublicMedia(post.meta.image),
					title: post.meta.title,
				}
			: undefined,
		noIndex: post.noIndex,
		publishedAt: post.publishedAt,
		readingTime: post.readingTime,
		relatedPostIDs,
		slug: post.slug,
		socialDescription: post.socialDescription,
		socialImage: mapPublicMedia(post.socialImage),
		socialTitle: post.socialTitle,
		title: post.title,
		topics: topics as PublicTopic[],
		updatedAt: post.updatedAt,
	}
}

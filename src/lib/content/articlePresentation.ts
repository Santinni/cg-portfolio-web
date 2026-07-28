import type { ArticleDate, ArticleSummary, ArticleTopic } from '@/components/article'

import type { PublicPost, PublicTopic } from './publicContent'

export interface InsightFilter {
	label: string
	slug?: string
}

const requestedFilters = [
	{ label: 'All' },
	{ label: 'Architecture', slug: 'architecture' },
	{ label: 'Performance', slug: 'performance' },
	{ label: 'Design systems', slug: 'design-systems' },
	{ label: 'Accessibility', slug: 'accessibility' },
] satisfies InsightFilter[]

const dateFormatter = new Intl.DateTimeFormat('en', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
})

export const formatArticleDate = (value?: null | string): ArticleDate | undefined => {
	if (!value) return undefined

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return undefined

	return {
		dateTime: value,
		label: dateFormatter.format(date),
	}
}

export const getInsightFilters = (topics: PublicTopic[]): InsightFilter[] =>
	requestedFilters.map((filter) => {
		if (!filter.slug) return filter

		const matchingTopic = topics.find(
			(topic) =>
				topic.slug === filter.slug ||
				topic.label.toLocaleLowerCase('en') === filter.label.toLowerCase(),
		)

		return matchingTopic ? { label: filter.label, slug: matchingTopic.slug } : filter
	})

export const getPostTopics = (post: PublicPost): ArticleTopic[] =>
	post.topics.map((topic) => ({
		href: `/insights?topic=${encodeURIComponent(topic.slug)}`,
		label: topic.label,
	}))

export const getReadingTime = (minutes?: null | number): string | undefined =>
	minutes && minutes > 0 ? `${minutes} min read` : undefined

export const toArticleSummary = (post: PublicPost): ArticleSummary => ({
	excerpt: post.excerpt,
	href: `/insights/${post.slug}`,
	publishedAt: formatArticleDate(post.publishedAt),
	readingTime: getReadingTime(post.readingTime),
	title: post.title,
	topics: getPostTopics(post),
	updatedAt:
		post.publishedAt && post.updatedAt !== post.publishedAt
			? formatArticleDate(post.updatedAt)
			: undefined,
})

export const getPostCanonical = (post: PublicPost): string =>
	post.canonicalURL || `/insights/${post.slug}`

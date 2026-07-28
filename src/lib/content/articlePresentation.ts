import type { Locale } from 'next-intl'

import type { ArticleDate, ArticleSummary, ArticleTopic } from '@/components/article'

import type { PublicPost, PublicTopic } from './publicContent'

export type InsightFilterKey =
	| 'all'
	| 'architecture'
	| 'performance'
	| 'designSystems'
	| 'accessibility'

export interface InsightFilter {
	key: InsightFilterKey
	slug?: string
}

interface ArticlePresentationOptions {
	locale: Locale
	formatReadingTime: (minutes: number) => string
}

const requestedFilters = [
	{ key: 'all' },
	{ key: 'architecture', label: 'Architecture', slug: 'architecture' },
	{ key: 'performance', label: 'Performance', slug: 'performance' },
	{ key: 'designSystems', label: 'Design systems', slug: 'design-systems' },
	{ key: 'accessibility', label: 'Accessibility', slug: 'accessibility' },
] as const

const localeTags: Record<Locale, string> = {
	en: 'en-US',
	cs: 'cs-CZ',
}

export const formatArticleDate = (
	value: null | string | undefined,
	locale: Locale,
): ArticleDate | undefined => {
	if (!value) return undefined

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return undefined

	return {
		dateTime: value,
		label: new Intl.DateTimeFormat(localeTags[locale], {
			day: 'numeric',
			month: 'short',
			timeZone: 'Europe/Prague',
			year: 'numeric',
		}).format(date),
	}
}

export const getInsightFilters = (topics: PublicTopic[]): InsightFilter[] =>
	requestedFilters.map((filter) => {
		if (!('slug' in filter)) return { key: filter.key }

		const matchingTopic = topics.find(
			(topic) =>
				topic.slug === filter.slug ||
				topic.label.toLocaleLowerCase('en-US') === filter.label.toLocaleLowerCase('en-US'),
		)

		return { key: filter.key, slug: matchingTopic?.slug ?? filter.slug }
	})

export const getPostTopics = (post: PublicPost): ArticleTopic[] =>
	post.topics.map((topic) => ({
		href: `/insights?topic=${encodeURIComponent(topic.slug)}`,
		label: topic.label,
	}))

export const getReadingTime = (
	minutes: null | number | undefined,
	format: (minutes: number) => string,
): string | undefined => (minutes && minutes > 0 ? format(minutes) : undefined)

export const getArticleHref = (slug: string): `/insights/${string}` => `/insights/${slug}`

export const toArticleSummary = (
	post: PublicPost,
	{ locale, formatReadingTime }: ArticlePresentationOptions,
): ArticleSummary => ({
	excerpt: post.excerpt,
	href: getArticleHref(post.slug),
	publishedAt: formatArticleDate(post.publishedAt, locale),
	readingTime: getReadingTime(post.readingTime, formatReadingTime),
	title: post.title,
	topics: getPostTopics(post),
	updatedAt:
		post.publishedAt && post.updatedAt !== post.publishedAt
			? formatArticleDate(post.updatedAt, locale)
			: undefined,
})

export const getPostCanonical = (post: PublicPost): string =>
	post.canonicalURL || getArticleHref(post.slug)

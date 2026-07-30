import type { Metadata } from 'next'
import Image from 'next/image'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { ArticleMetadata, AuthorContext, EditorialState, ShareBar } from '@/components/article'
import { ArticleBody } from '@/components/article/ArticleBody'
import { Eyebrow } from '@/components/site/Eyebrow'
import { siteConfig } from '@/content/site'
import {
	formatArticleDate,
	getArticleHref,
	getPostCanonical,
	getPostTopics,
	getReadingTime,
} from '@/lib/content/articlePresentation'
import { getPublishedPostBySlug } from '@/lib/content/posts.server'

import styles from './InsightArticlePage.module.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const getInsight = cache(getPublishedPostBySlug)

interface InsightArticlePageProps {
	params: Promise<{ locale: Locale; slug: string }>
}

const getEnglishAlternates = (canonical: string): Metadata['alternates'] => ({
	canonical,
	languages: { en: canonical, 'x-default': canonical },
})

export async function generateMetadata({ params }: InsightArticlePageProps): Promise<Metadata> {
	const { locale, slug } = await params
	const fallbackCanonical = getArticleHref(slug)

	if (locale === 'cs') {
		return {
			alternates: getEnglishAlternates(fallbackCanonical),
			robots: { follow: true, index: false },
		}
	}

	const t = await getTranslations({ locale, namespace: 'article.detail' })

	try {
		const post = await getInsight(slug)
		if (!post) {
			return {
				title: t('notFoundTitle'),
				alternates: getEnglishAlternates(fallbackCanonical),
				robots: { follow: true, index: false },
			}
		}

		const title = post.meta?.title || post.socialTitle || post.title
		const description = post.meta?.description || post.socialDescription || post.excerpt
		const canonical = getPostCanonical(post)
		const socialImage = post.meta?.image || post.socialImage || post.featuredImage

		return {
			title,
			description,
			alternates: getEnglishAlternates(canonical),
			robots: { follow: true, index: !post.noIndex },
			openGraph: {
				type: 'article',
				title,
				description,
				locale: 'en_US',
				url: canonical,
				publishedTime: post.publishedAt || undefined,
				modifiedTime: post.updatedAt,
				images: socialImage.url
					? [{ alt: socialImage.alt || post.title, url: socialImage.url }]
					: undefined,
			},
			twitter: {
				card: 'summary_large_image',
				title,
				description,
				images: socialImage.url ? [socialImage.url] : undefined,
			},
		}
	} catch {
		return {
			title: t('unavailableTitle'),
			alternates: getEnglishAlternates(fallbackCanonical),
			robots: { follow: true, index: false },
		}
	}
}

export default async function InsightArticlePage({ params }: InsightArticlePageProps) {
	const { locale, slug } = await params

	if (locale === 'cs') redirect(getArticleHref(slug))

	setRequestLocale(locale)
	const [t, articleT] = await Promise.all([
		getTranslations('article.detail'),
		getTranslations('article'),
	])
	let post

	try {
		post = await getInsight(slug)
	} catch {
		return (
			<section className={styles.unavailable} aria-label={t('unavailableLabel')}>
				<Container>
					<EditorialState
						actionHref="/insights"
						actionLabel={t('returnToInsights')}
						description={t('unavailableDescription')}
						kind="error"
					/>
				</Container>
			</section>
		)
	}

	if (!post) notFound()

	let shareURL = `${siteConfig.url}${getArticleHref(post.slug)}`
	try {
		shareURL = new URL(getPostCanonical(post), siteConfig.url).toString()
	} catch {
		// A malformed optional CMS canonical must not prevent the article from rendering.
	}
	const publishedAt = formatArticleDate(post.publishedAt, locale)
	const updatedAt =
		post.publishedAt && post.updatedAt !== post.publishedAt
			? formatArticleDate(post.updatedAt, locale)
			: undefined
	const imageURL = post.featuredImage.url
	const readingTime = getReadingTime(post.readingTime, (minutes) =>
		articleT('readingTime', { minutes }),
	)

	return (
		<>
			<article lang="en">
				<header className={styles.hero}>
					<Container className={styles.heroInner}>
						<Eyebrow>{t('eyebrow')}</Eyebrow>
						<h1 className={styles.title}>{post.title}</h1>
						<p className={styles.excerpt}>{post.excerpt}</p>
						<ArticleMetadata
							publishedAt={publishedAt}
							readingTime={readingTime}
							topics={getPostTopics(post)}
							updatedAt={updatedAt}
						/>
					</Container>
				</header>

				{imageURL ? (
					<Container className={styles.mediaContainer}>
						<figure className={styles.featuredMedia}>
							<Image
								alt={post.featuredImage.decorative ? '' : post.featuredImage.alt || post.title}
								height={post.featuredImage.height || 900}
								priority
								sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc(100vw - 96px), 1200px"
								src={imageURL}
								width={post.featuredImage.width || 1600}
							/>
							{post.featuredImage.caption ? (
								<figcaption>{post.featuredImage.caption}</figcaption>
							) : null}
						</figure>
					</Container>
				) : null}

				<div className={styles.articleSection}>
					<Container className={styles.articleLayout}>
						<aside className={styles.share} aria-label={articleT('share.controlsLabel')}>
							<ShareBar text={post.excerpt} title={post.title} url={shareURL} />
						</aside>

						<div className={styles.articleMain}>
							<div className={styles.prose}>
								<ArticleBody content={post.content} />
							</div>
							<AuthorContext
								bio={post.author.biography || undefined}
								name={post.author.name}
								role={post.author.role || undefined}
							/>
						</div>
					</Container>
				</div>
			</article>

			<section className={styles.cta} aria-labelledby="article-cta-heading">
				<Container className={styles.ctaInner}>
					<Eyebrow>{articleT('cta.eyebrow')}</Eyebrow>
					<h2 id="article-cta-heading" className={styles.ctaTitle}>
						{articleT('cta.title')}
					</h2>
					<p className={styles.ctaCopy}>{articleT('cta.description')}</p>
					<Button renders="link" href="/contact" variant="primary">
						{articleT('cta.label')}
					</Button>
				</Container>
			</section>
		</>
	)
}

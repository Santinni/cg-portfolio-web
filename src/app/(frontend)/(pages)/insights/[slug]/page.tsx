import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { ArticleMetadata, AuthorContext, EditorialState, ShareBar } from '@/components/article'
import { ArticleBody } from '@/components/article/ArticleBody'
import { Eyebrow } from '@/components/site/Eyebrow'
import { siteConfig } from '@/content/site'
import {
	formatArticleDate,
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
	params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: InsightArticlePageProps): Promise<Metadata> {
	const { slug } = await params

	try {
		const post = await getInsight(slug)
		if (!post) {
			return {
				title: 'Insight not found',
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
			alternates: { canonical },
			robots: { follow: true, index: !post.noIndex },
			openGraph: {
				type: 'article',
				title,
				description,
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
			title: 'Insight temporarily unavailable',
			robots: { follow: true, index: false },
		}
	}
}

export default async function InsightArticlePage({ params }: InsightArticlePageProps) {
	const { slug } = await params
	let post

	try {
		post = await getInsight(slug)
	} catch {
		return (
			<section className={styles.unavailable} aria-label="Insight unavailable">
				<Container>
					<EditorialState
						actionHref="/insights"
						actionLabel="Return to insights"
						description="The editorial service is temporarily unavailable. Please try again later."
						kind="error"
					/>
				</Container>
			</section>
		)
	}

	if (!post) notFound()

	let shareURL = `${siteConfig.url}/insights/${post.slug}`
	try {
		shareURL = new URL(getPostCanonical(post), siteConfig.url).toString()
	} catch {
		// A malformed optional CMS canonical must not prevent the article from rendering.
	}
	const publishedAt = formatArticleDate(post.publishedAt)
	const updatedAt =
		post.publishedAt && post.updatedAt !== post.publishedAt
			? formatArticleDate(post.updatedAt)
			: undefined
	const imageURL = post.featuredImage.url

	return (
		<>
			<article>
				<header className={styles.hero}>
					<Container className={styles.heroInner}>
						<Eyebrow>INSIGHT</Eyebrow>
						<h1 className={styles.title}>{post.title}</h1>
						<p className={styles.excerpt}>{post.excerpt}</p>
						<ArticleMetadata
							publishedAt={publishedAt}
							readingTime={getReadingTime(post.readingTime)}
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
						<aside className={styles.share} aria-label="Article sharing controls">
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
					<Eyebrow>HAVE A SIMILAR FRONTEND PROBLEM?</Eyebrow>
					<h2 id="article-cta-heading" className={styles.ctaTitle}>
						Let’s make the system behind the interface easier to change.
					</h2>
					<p className={styles.ctaCopy}>
						I work with product teams on architecture, accessibility, performance and long-term
						frontend quality.
					</p>
					<Button renders="link" href="/contact" variant="primary">
						Start a conversation
					</Button>
				</Container>
			</section>
		</>
	)
}

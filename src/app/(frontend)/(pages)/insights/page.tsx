import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { ArticleCard, EditorialState } from '@/components/article'
import { Eyebrow } from '@/components/site/Eyebrow'
import { getInsightFilters, toArticleSummary } from '@/lib/content/articlePresentation'
import { listPublishedPosts, listPublicTopics } from '@/lib/content/posts.server'
import type { PublicPost } from '@/lib/content/publicContent'

import styles from './InsightsPage.module.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
	title: 'Insights',
	description:
		'Practical writing about frontend architecture, performance, accessibility and maintainable interface systems.',
	alternates: { canonical: '/insights' },
	openGraph: {
		title: 'Frontend engineering insights — Karel Kutchan',
		description:
			'Practical writing about frontend architecture, performance, accessibility and maintainable interface systems.',
		url: '/insights',
	},
}

interface InsightsPageProps {
	searchParams: Promise<{ topic?: string | string[] }>
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
	const query = await searchParams
	const selectedTopic = typeof query.topic === 'string' ? query.topic : undefined
	let posts: PublicPost[] = []
	let filters = getInsightFilters([])
	let loadFailed = false

	try {
		const [postResult, topics] = await Promise.all([
			listPublishedPosts({ limit: 12, topicSlug: selectedTopic }),
			listPublicTopics(),
		])
		posts = postResult.docs
		filters = getInsightFilters(topics)
	} catch {
		loadFailed = true
	}

	const featuredPost = posts.find((post) => post.featured) ?? posts[0]
	const latestPosts = featuredPost ? posts.filter((post) => post.id !== featuredPost.id) : []
	const featuredImageURL = featuredPost?.featuredImage.url

	return (
		<>
			<header className={styles.hero}>
				<Container className={styles.heroInner}>
					<Eyebrow>INSIGHTS</Eyebrow>
					<h1 className={styles.title}>Notes from frontend engineering</h1>
					<p className={styles.intro}>
						Practical writing about interface architecture, performance, accessibility and systems
						that remain maintainable after launch.
					</p>
				</Container>
			</header>

			<div className={styles.filterBar}>
				<Container>
					<nav aria-label="Filter insights by topic">
						<ul className={styles.filters}>
							{filters.map((filter) => {
								const isCurrent = filter.slug ? selectedTopic === filter.slug : !selectedTopic
								const href = filter.slug
									? `/insights?topic=${encodeURIComponent(filter.slug)}`
									: '/insights'

								return (
									<li key={filter.label}>
										<Link
											className={isCurrent ? styles.filterActive : styles.filter}
											href={href}
											aria-current={isCurrent ? 'page' : undefined}
										>
											{filter.label}
										</Link>
									</li>
								)
							})}
						</ul>
					</nav>
				</Container>
			</div>

			<section className={styles.content} aria-label="Published insights">
				<Container>
					{loadFailed ? (
						<EditorialState
							actionHref="/contact"
							actionLabel="Contact me"
							description="The editorial service is temporarily unavailable. The rest of the portfolio is still available."
							kind="error"
						/>
					) : !featuredPost ? (
						<EditorialState
							actionHref="/contact"
							actionLabel="Start a conversation"
							description={
								selectedTopic
									? 'No published insight currently matches this topic.'
									: 'New notes on frontend engineering will appear here after publication.'
							}
							kind="empty"
						/>
					) : (
						<div className={styles.editorialGrid}>
							<section aria-labelledby="featured-insight-heading" className={styles.featured}>
								<Eyebrow>FEATURED</Eyebrow>
								<h2 id="featured-insight-heading" className={styles.visuallyHidden}>
									Featured insight
								</h2>
								<ArticleCard
									variant="featured"
									{...toArticleSummary(featuredPost)}
									image={
										featuredImageURL ? (
											<Image
												alt={
													featuredPost.featuredImage.decorative
														? ''
														: featuredPost.featuredImage.alt || featuredPost.title
												}
												height={featuredPost.featuredImage.height || 720}
												sizes="(max-width: 767px) calc(100vw - 40px), 50vw"
												src={featuredImageURL}
												width={featuredPost.featuredImage.width || 960}
											/>
										) : undefined
									}
								/>
							</section>

							{latestPosts.length ? (
								<section aria-labelledby="latest-insights-heading" className={styles.latest}>
									<h2 id="latest-insights-heading" className={styles.sectionTitle}>
										Latest insights
									</h2>
									<div className={styles.cards}>
										{latestPosts.map((post) => (
											<ArticleCard key={post.id} headingLevel={3} {...toArticleSummary(post)} />
										))}
									</div>
								</section>
							) : null}
						</div>
					)}
				</Container>
			</section>

			<section className={styles.cta} aria-labelledby="insights-cta-heading">
				<Container className={styles.ctaInner}>
					<Eyebrow>WORKING ON A SIMILAR PROBLEM?</Eyebrow>
					<h2 id="insights-cta-heading" className={styles.ctaTitle}>
						Turn a frontend constraint into a product decision.
					</h2>
					<p className={styles.ctaCopy}>
						I help teams simplify frontend architecture, improve product performance and build
						interfaces that remain dependable.
					</p>
					<Button renders="link" href="/contact" variant="primary">
						Start a conversation
					</Button>
				</Container>
			</section>
		</>
	)
}

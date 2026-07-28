import type { Metadata } from 'next'
import Image from 'next/image'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { ArticleCard, EditorialState } from '@/components/article'
import { Eyebrow } from '@/components/site/Eyebrow'
import { createLocalizedMetadata } from '@/i18n/metadata'
import { Link } from '@/i18n/navigation'
import { getInsightFilters, toArticleSummary } from '@/lib/content/articlePresentation'
import { listPublishedPosts, listPublicTopics } from '@/lib/content/posts.server'
import type { PublicPost } from '@/lib/content/publicContent'

import styles from './InsightsPage.module.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface InsightsPageProps {
	params: Promise<{ locale: Locale }>
	searchParams: Promise<{ topic?: string | string[] }>
}

export async function generateMetadata({ params }: InsightsPageProps): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'insights.metadata' })

	return createLocalizedMetadata({
		locale,
		pathname: '/insights',
		title: t('title'),
		description: t('description'),
		openGraphTitle: t('openGraphTitle'),
	})
}

export default async function InsightsPage({ params, searchParams }: InsightsPageProps) {
	const [{ locale }, query] = await Promise.all([params, searchParams])
	setRequestLocale(locale)
	const [t, articleT] = await Promise.all([getTranslations('insights'), getTranslations('article')])
	const selectedTopic = typeof query.topic === 'string' ? query.topic : undefined
	const formatReadingTime = (minutes: number) => articleT('readingTime', { minutes })
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
	const presentPost = (post: PublicPost) => toArticleSummary(post, { locale, formatReadingTime })

	return (
		<>
			<header className={styles.hero}>
				<Container className={styles.heroInner}>
					<Eyebrow>{t('hero.eyebrow')}</Eyebrow>
					<h1 className={styles.title}>{t('hero.title')}</h1>
					<p className={styles.intro}>{t('hero.intro')}</p>
				</Container>
			</header>

			<div className={styles.filterBar}>
				<Container>
					<nav aria-label={t('filters.label')}>
						<ul className={styles.filters}>
							{filters.map((filter) => {
								const isCurrent = filter.slug ? selectedTopic === filter.slug : !selectedTopic
								const href = filter.slug
									? `/insights?topic=${encodeURIComponent(filter.slug)}`
									: '/insights'

								return (
									<li key={filter.key}>
										<Link
											className={isCurrent ? styles.filterActive : styles.filter}
											href={href}
											aria-current={isCurrent ? 'page' : undefined}
										>
											{t(`filters.${filter.key}`)}
										</Link>
									</li>
								)
							})}
						</ul>
					</nav>
				</Container>
			</div>

			<section className={styles.content} aria-label={t('content.label')}>
				<Container>
					{locale === 'cs' ? <p>{t('content.englishOnlyNotice')}</p> : null}
					{loadFailed ? (
						<EditorialState
							actionHref="/contact"
							actionLabel={t('states.contactMe')}
							description={t('states.serviceUnavailable')}
							kind="error"
						/>
					) : !featuredPost ? (
						<EditorialState
							actionHref="/contact"
							actionLabel={t('states.startConversation')}
							description={selectedTopic ? t('states.noTopicMatch') : t('states.noPosts')}
							kind="empty"
						/>
					) : (
						<div className={styles.editorialGrid}>
							<section aria-labelledby="featured-insight-heading" className={styles.featured}>
								<Eyebrow>{t('featured.eyebrow')}</Eyebrow>
								<h2 id="featured-insight-heading" className={styles.visuallyHidden}>
									{t('featured.title')}
								</h2>
								<ArticleCard
									variant="featured"
									{...presentPost(featuredPost)}
									image={
										featuredImageURL ? (
											<Image
												alt={
													featuredPost.featuredImage.decorative
														? ''
														: featuredPost.featuredImage.alt || featuredPost.title
												}
												height={featuredPost.featuredImage.height || 720}
												lang="en"
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
										{t('latest.title')}
									</h2>
									<div className={styles.cards}>
										{latestPosts.map((post) => (
											<ArticleCard key={post.id} headingLevel={3} {...presentPost(post)} />
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
					<Eyebrow>{t('cta.eyebrow')}</Eyebrow>
					<h2 id="insights-cta-heading" className={styles.ctaTitle}>
						{t('cta.title')}
					</h2>
					<p className={styles.ctaCopy}>{t('cta.description')}</p>
					<Button renders="link" href="/contact" variant="primary">
						{t('cta.label')}
					</Button>
				</Container>
			</section>
		</>
	)
}

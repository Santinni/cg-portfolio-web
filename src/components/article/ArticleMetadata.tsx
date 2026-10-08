import { useTranslations } from 'next-intl'

import { Button } from '@/app/(frontend)/components/primitives/button'

import styles from './Article.module.css'
import type { ArticleDate, ArticleTopic } from './types'

export interface ArticleMetadataProps {
	publishedAt?: ArticleDate
	readingTime?: string
	topics?: readonly ArticleTopic[]
	updatedAt?: ArticleDate
}

export function ArticleMetadata({
	publishedAt,
	readingTime,
	topics = [],
	updatedAt,
}: ArticleMetadataProps) {
	const t = useTranslations('article.metadata')

	return (
		<div>
			<ul className={styles.metadata} aria-label={t('label')}>
				{publishedAt ? (
					<li className={styles.metadataItem}>
						<span>{t('published')}</span>
						<time dateTime={publishedAt.dateTime}>{publishedAt.label}</time>
					</li>
				) : null}
				{updatedAt ? (
					<li className={styles.metadataItem}>
						<span>{t('updated')}</span>
						<time dateTime={updatedAt.dateTime}>{updatedAt.label}</time>
					</li>
				) : null}
				{readingTime ? <li className={styles.metadataItem}>{readingTime}</li> : null}
			</ul>
			{topics.length ? (
				<ul className={styles.topics} aria-label={t('topics')} data-article-topics>
					{topics.map((topic) => (
						<li key={topic.href ?? topic.label}>
							{topic.href ? (
								<Button
									renders="link"
									href={topic.href}
									prefetch={false}
									size="small"
									variant="secondary"
									lang="en"
								>
									{topic.label}
								</Button>
							) : (
								<span className={styles.topicLabel} lang="en">
									{topic.label}
								</span>
							)}
						</li>
					))}
				</ul>
			) : null}
		</div>
	)
}

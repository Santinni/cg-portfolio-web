import styles from './Article.module.css'
import { useTranslations } from 'next-intl'
import type { TableOfContentsItem } from './types'

export interface TableOfContentsProps {
	items: readonly TableOfContentsItem[]
	title?: string
}

function TocList({ items }: Pick<TableOfContentsProps, 'items'>) {
	return (
		<ol className={styles.tocList}>
			{items.map((item) => (
				<li key={item.id}>
					<a
						className={styles.tocLink}
						href={`#${item.id}`}
						style={{ '--toc-depth': Math.max(0, (item.level ?? 2) - 2) } as React.CSSProperties}
					>
						{item.label}
					</a>
				</li>
			))}
		</ol>
	)
}

export function TableOfContents({ items, title }: TableOfContentsProps) {
	const t = useTranslations('article.tableOfContents')
	const resolvedTitle = title ?? t('title')

	if (!items.length) return null

	return (
		<nav aria-label={resolvedTitle}>
			<div className={`${styles.toc} ${styles.tocDesktop}`}>
				<p className={styles.tocTitle}>{resolvedTitle}</p>
				<TocList items={items} />
			</div>
			<details className={`${styles.toc} ${styles.tocMobile}`}>
				<summary className={styles.tocSummary}>{resolvedTitle}</summary>
				<TocList items={items} />
			</details>
		</nav>
	)
}

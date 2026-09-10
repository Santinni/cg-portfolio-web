import { Button } from '@/app/(frontend)/components/primitives/button'
import type { InsightFilter, InsightFilterKey } from '@/lib/content/articlePresentation'

import styles from './InsightsPage.module.css'

interface InsightFiltersProps {
	filters: InsightFilter[]
	/** Accessible name of the filter navigation. */
	label: string
	/** Copy resolved by the page so this component needs no next-intl server API. */
	labels: Record<InsightFilterKey, string>
	selectedTopic?: string
}

/**
 * Server-rendered topic navigation for Insights. Filtering is a navigation to
 * `?topic=<slug>`, so each control stays a link with `aria-current="page"` on
 * the selected one; only the presentation follows Figma `74:291`.
 */
export function InsightFilters({ filters, label, labels, selectedTopic }: InsightFiltersProps) {
	return (
		<nav aria-label={label}>
			<ul className={styles.filters}>
				{filters.map((filter) => {
					const isCurrent = filter.slug ? selectedTopic === filter.slug : !selectedTopic
					const href = filter.slug
						? `/insights?topic=${encodeURIComponent(filter.slug)}`
						: '/insights'

					return (
						<li key={filter.key}>
							<Button
								className={styles.filterLink}
								renders="link"
								href={href}
								size="small"
								variant={isCurrent ? 'secondary' : 'quiet'}
								aria-current={isCurrent ? 'page' : undefined}
							>
								{labels[filter.key]}
							</Button>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

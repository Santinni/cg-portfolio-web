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
 *
 * `prefetch={false}` is load-bearing, not an optimisation. With the default
 * prefetch, a navigation from the bare `/insights` to `/insights?topic=...`
 * updated the URL and rendered nothing new: the router answered from the
 * prefetched entry and never requested the dynamic page, so the current
 * filter and the result set stayed on "All" (measured in the pinned container
 * and on production on 2026-09-11; navigating between two `?topic=` URLs was
 * unaffected). Disabling prefetch makes every filter activation fetch the page
 * it navigates to.
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
								prefetch={false}
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

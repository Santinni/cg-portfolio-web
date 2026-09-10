import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { InsightFilters } from '@/app/[locale]/(frontend)/(pages)/insights/InsightFilters'
import { getInsightFilters, type InsightFilter } from '@/lib/content/articlePresentation'

// Keep the component test focused on filter semantics rather than next-intl routing.
vi.mock('@/i18n/navigation', () => ({
	Link: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode
		href: string
		[key: string]: unknown
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}))

const label = 'Filter insights by topic'
const labels = {
	all: 'All',
	architecture: 'Architecture',
	performance: 'Performance',
	designSystems: 'Design systems',
	accessibility: 'Accessibility',
}
const orderedLabels = [
	labels.all,
	labels.architecture,
	labels.performance,
	labels.designSystems,
	labels.accessibility,
]
const orderedHrefs = [
	'/insights',
	'/insights?topic=architecture',
	'/insights?topic=performance',
	'/insights?topic=design-systems',
	'/insights?topic=accessibility',
]

const renderFilters = (selectedTopic?: string, filters: InsightFilter[] = getInsightFilters([])) =>
	render(
		<InsightFilters
			filters={filters}
			label={label}
			labels={labels}
			selectedTopic={selectedTopic}
		/>,
	)

const getFilterLinks = () =>
	within(screen.getByRole('navigation', { name: label })).getAllByRole('link')

describe('InsightFilters', () => {
	it('renders the labelled navigation with five links in the approved order', () => {
		renderFilters()
		const links = getFilterLinks()

		expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', label)
		expect(links).toHaveLength(5)
		expect(links.map((link) => link.textContent)).toEqual(orderedLabels)
		expect(links.map((link) => link.getAttribute('href'))).toEqual(orderedHrefs)
		expect(links.every((link) => link.closest('li') !== null)).toBe(true)
	})

	it('keeps the controls as links, never toggle buttons or tabs', () => {
		renderFilters()
		const nav = screen.getByRole('navigation', { name: label })

		expect(within(nav).queryAllByRole('button')).toHaveLength(0)
		expect(within(nav).queryByRole('tablist')).not.toBeInTheDocument()
		expect(nav.querySelectorAll('[aria-pressed]')).toHaveLength(0)
	})

	it('marks "All" as current when no topic is selected', () => {
		renderFilters()
		const [all, ...rest] = getFilterLinks()

		expect(all).toHaveAttribute('aria-current', 'page')
		expect(all.className).toContain('variant-secondary')
		expect(all.className).not.toContain('variant-quiet')
		for (const link of rest) {
			expect(link).not.toHaveAttribute('aria-current')
			expect(link.className).toContain('variant-quiet')
			expect(link.className).not.toContain('variant-secondary')
		}
	})

	it('marks the selected topic as current and demotes "All"', () => {
		renderFilters('design-systems')
		const links = getFilterLinks()
		const current = links.filter((link) => link.getAttribute('aria-current') === 'page')

		expect(current).toHaveLength(1)
		expect(current[0]).toHaveTextContent(labels.designSystems)
		expect(current[0].className).toContain('variant-secondary')
		for (const link of links) {
			if (link === current[0]) continue
			expect(link).not.toHaveAttribute('aria-current')
			expect(link.className).toContain('variant-quiet')
		}
	})

	it('renders every filter as a small design-system button link', () => {
		renderFilters('performance')

		for (const link of getFilterLinks()) {
			expect(link.className).toContain('size-small')
			expect(link.className).toContain('filterLink')
		}
	})

	it('encodes topic slugs in the href', () => {
		renderFilters(undefined, [{ key: 'all' }, { key: 'designSystems', slug: 'design systems/ux' }])
		const [, encoded] = getFilterLinks()

		expect(encoded).toHaveAttribute('href', '/insights?topic=design%20systems%2Fux')
	})
})

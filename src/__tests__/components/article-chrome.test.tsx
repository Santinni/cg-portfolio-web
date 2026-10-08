import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	ArticleCard,
	ArticleMetadata,
	CodeBlock,
	ShareBar,
	TableOfContents,
} from '@/components/article'
import csMessages from '../../../messages/cs.json'

vi.mock('next/link', () => ({
	default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}))

// `prefetch` is a Link prop, not an anchor attribute: expose it as a data attribute so the
// topic-tag test can assert the navigation contract without a real router.
vi.mock('@/i18n/navigation', () => ({
	Link: ({
		children,
		href,
		prefetch,
		...props
	}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { prefetch?: boolean | null }) => (
		<a href={href} data-prefetch={String(prefetch)} {...props}>
			{children}
		</a>
	),
}))

function renderCzech(node: React.ReactNode) {
	return render(
		<NextIntlClientProvider locale="cs" messages={csMessages}>
			{node}
		</NextIntlClientProvider>,
	)
}

describe('localized article chrome', () => {
	beforeEach(() => {
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: { writeText: vi.fn().mockResolvedValue(undefined) },
		})
	})

	it('renders Czech metadata labels while marking CMS topics as English', () => {
		renderCzech(
			<ArticleMetadata
				publishedAt={{ dateTime: '2026-01-02T00:00:00.000Z', label: '2. 1. 2026' }}
				readingTime="2 minuty čtení"
				topics={[{ href: '/insights?topic=architecture', label: 'Architecture' }]}
			/>,
		)

		expect(screen.getByRole('list', { name: 'Metadata článku' })).toBeVisible()
		expect(screen.getByText('Publikováno')).toBeVisible()
		expect(screen.getByRole('list', { name: 'Témata článku' })).toBeVisible()
		expect(screen.getByRole('link', { name: 'Architecture' })).toHaveAttribute('lang', 'en')
	})

	it('renders linked topics as small secondary design-system button links without prefetch', () => {
		renderCzech(
			<ArticleMetadata
				topics={[
					{ href: '/insights?topic=architecture', label: 'Architecture' },
					{ href: '/insights?topic=performance', label: 'Performance' },
				]}
			/>,
		)
		const list = screen.getByRole('list', { name: 'Témata článku' })
		expect(list).toHaveAttribute('data-article-topics')
		const topics = within(list)
		const links = topics.getAllByRole('link')

		expect(links).toHaveLength(2)
		expect(links.map((link) => link.getAttribute('href'))).toEqual([
			'/insights?topic=architecture',
			'/insights?topic=performance',
		])
		for (const link of links) {
			expect(link.tagName).toBe('A')
			expect(link).toHaveAttribute('lang', 'en')
			expect(link.className).toContain('variant-secondary')
			expect(link.className).toContain('size-small')
			expect(link.className).not.toContain('variant-quiet')
			expect(link.className).not.toContain('variant-primary')
			expect(link).toHaveAttribute('data-prefetch', 'false')
			// The hero override targets `[data-article-topics] > li > a`; keep the markup that shape.
			expect(link.parentElement?.parentElement).toBe(list)
		}
	})

	it('renders a topic without href as English text, never as a link', () => {
		renderCzech(<ArticleMetadata topics={[{ label: 'Accessibility' }]} />)
		const topics = within(screen.getByRole('list', { name: 'Témata článku' }))

		expect(topics.queryAllByRole('link')).toHaveLength(0)
		const label = topics.getByText('Accessibility')
		expect(label.tagName).toBe('SPAN')
		expect(label).toHaveAttribute('lang', 'en')
		expect(label.className).toContain('topicLabel')
	})

	it('localizes share controls and copy success feedback', async () => {
		const user = userEvent.setup()
		renderCzech(<ShareBar title="English article" url="https://codeguy.cz/insights/article" />)

		await user.click(screen.getByRole('button', { name: 'Kopírovat odkaz' }))

		expect(screen.getByRole('status')).toHaveTextContent('Odkaz byl zkopírován.')
	})

	it('localizes code controls and announces a successful copy', async () => {
		const user = userEvent.setup()
		renderCzech(<CodeBlock code="const answer = 42" language="ts" />)

		expect(screen.getByRole('figure', { name: 'Ukázka kódu' })).toBeVisible()
		await user.click(screen.getByRole('button', { name: 'Kopírovat' }))

		expect(screen.getByText('Zkopírováno')).toBeVisible()
		expect(screen.getByText('Kód byl zkopírován.')).toBeInTheDocument()
	})

	it('localizes the default table of contents label', () => {
		renderCzech(<TableOfContents items={[{ id: 'architecture', label: 'Architecture' }]} />)

		expect(screen.getByRole('navigation', { name: 'Na této stránce' })).toBeVisible()
	})

	it('marks CMS card copy as English and keeps its article URL unprefixed', () => {
		renderCzech(
			<ArticleCard
				excerpt="English editorial excerpt"
				href="/insights/frontend-systems"
				title="Frontend systems"
			/>,
		)

		expect(screen.getByRole('heading', { name: 'Frontend systems' })).toHaveAttribute('lang', 'en')
		expect(screen.getByRole('link', { name: 'Frontend systems' })).toHaveAttribute(
			'href',
			'/insights/frontend-systems',
		)
		expect(screen.getByText('English editorial excerpt')).toHaveAttribute('lang', 'en')
	})
})

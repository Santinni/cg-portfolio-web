import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'

import { WorkCard } from '@/components/work/WorkCard'
import type { WorkItem } from '@/content/work'
import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

vi.mock('@/i18n/navigation', async () => {
	const { useLocale } = await import('next-intl')

	return {
		Link: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
			const locale = useLocale()
			const localizedHref = locale === 'cs' ? `/cs${href}` : href

			return (
				<a href={localizedHref} {...props}>
					{children}
				</a>
			)
		},
	}
})

const availableItem: WorkItem = {
	key: 'maintenanceApplications',
	slug: 'maintenance-applications',
	stack: ['React', 'TypeScript'],
	status: 'available',
	href: '/work/maintenance-applications',
}

const pendingItem: WorkItem = {
	key: 'accessibilityRefactoring',
	slug: 'accessibility-refactoring',
	stack: ['React', 'TypeScript'],
	status: 'pending',
}

describe('WorkCard localization', () => {
	it('keeps the shared summary as the default presentation', () => {
		render(
			<NextIntlClientProvider locale="en" messages={enMessages}>
				<WorkCard item={availableItem} />
			</NextIntlClientProvider>,
		)

		expect(
			screen.getByText('Reusable frontend architecture for enterprise maintenance workflows.'),
		).toBeVisible()
		expect(
			screen.queryByText('Reusable architecture for specialist workflows.'),
		).not.toBeInTheDocument()
	})

	it('renders both responsive summary variants for browser-controlled visibility', () => {
		render(
			<NextIntlClientProvider locale="en" messages={enMessages}>
				<WorkCard
					item={availableItem}
					compactSummary="Reusable architecture for specialist workflows."
					density="responsive"
				/>
			</NextIntlClientProvider>,
		)

		expect(
			screen.getByText('Reusable frontend architecture for enterprise maintenance workflows.'),
		).toBeInTheDocument()
		expect(screen.getByText('Reusable architecture for specialist workflows.')).toBeInTheDocument()
	})

	it('keeps the English case-study URL unprefixed', () => {
		render(
			<NextIntlClientProvider locale="en" messages={enMessages}>
				<WorkCard item={availableItem} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByRole('link', { name: 'Read case' })).toHaveAttribute(
			'href',
			'/work/maintenance-applications',
		)
	})

	it('preserves Czech locale in the case-study URL', () => {
		render(
			<NextIntlClientProvider locale="cs" messages={csMessages}>
				<WorkCard item={availableItem} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByRole('link', { name: 'Přečíst studii' })).toHaveAttribute(
			'href',
			'/cs/work/maintenance-applications',
		)
	})

	it('renders Czech pending copy without an actionable link', () => {
		render(
			<NextIntlClientProvider locale="cs" messages={csMessages}>
				<WorkCard item={pendingItem} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText('Případová studie se připravuje')).toBeVisible()
		expect(screen.queryByRole('link')).not.toBeInTheDocument()
	})
})

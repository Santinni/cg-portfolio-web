import { render, screen, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'
import { contact } from '@/content/site'

vi.mock('next-intl/server', () => ({
	getTranslations: async (namespace: string) => {
		const { messages } = await import('./site-footer.test-locale')
		const segments = namespace.split('.')
		const scope = segments.reduce<Record<string, unknown>>(
			(node, key) => node[key] as Record<string, unknown>,
			messages as unknown as Record<string, unknown>,
		)
		return (key: string, values?: Record<string, string | number>) => {
			const value = key
				.split('.')
				.reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], scope) as string
			return value.replace(/\{(\w+)\}/g, (_match, name) => String(values?.[name]))
		}
	},
}))

vi.mock('@/i18n/navigation', () => ({
	Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
		<a href={href} {...rest}>
			{children}
		</a>
	),
}))

const catalogs = [
	['en', enMessages],
	['cs', csMessages],
] as const

describe('SiteFooter', () => {
	it.each(catalogs)('renders the %s footer contract', async (locale, messages) => {
		const localeModule = await import('./site-footer.test-locale')
		localeModule.setMessages(messages)
		const { SiteFooter } = await import('@/app/(frontend)/components/layout/SiteFooter')
		const element = await SiteFooter()
		render(
			<NextIntlClientProvider locale={locale} messages={messages}>
				{element}
			</NextIntlClientProvider>,
		)

		const footer = screen.getByRole('contentinfo')
		expect(within(footer).getAllByRole('heading', { level: 2 })).toHaveLength(2)
		expect(within(footer).getByText(messages.home.hero.identity.name)).toBeInTheDocument()
		expect(within(footer).getByText(messages.footer.role)).toBeInTheDocument()

		const email = footer.querySelector('a[data-contact-method="email"]')
		expect(email).toHaveAttribute('href', `mailto:${contact.email}`)
		expect(email).not.toHaveAttribute('target')
		expect(footer.querySelector('a[data-contact-method="linkedin"]')).toHaveAttribute(
			'target',
			'_blank',
		)
		expect(footer.querySelector('[data-contact-method="location"]')).toBeNull()

		expect(
			within(footer).getByRole('link', { name: messages.footer.links.curriculumVitae }),
		).toHaveAttribute('href', '/curriculum-vitae')
		expect(
			within(footer).getByRole('link', { name: messages.footer.links.booking }),
		).toHaveAttribute('href', '/contact/book')
		expect(footer.querySelector('a[download]')).toBeNull()
		expect(footer.querySelectorAll('section')).toHaveLength(0)
		expect(
			within(footer).getByText(`© ${new Date().getFullYear()} ${messages.home.hero.identity.name}`),
		).toBeInTheDocument()
	})
})

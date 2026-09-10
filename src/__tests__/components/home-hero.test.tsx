import { render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Hero from '@/app/[locale]/(frontend)/(pages)/(home)/blocks/hero'
import { homeLinks } from '@/content/profile'
import { contact } from '@/content/site'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

const catalogs = { cs: csMessages, en: enMessages } as const
type LocaleId = keyof typeof catalogs

const intlState = vi.hoisted(() => ({ locale: 'en' as 'cs' | 'en' }))

/** The Hero only reads these two namespaces; the mock resolves them from the real catalogs. */
type HeroNamespace = 'contact.methods' | 'home.hero'

vi.mock('next-intl/server', async () => {
	const { createTranslator: create } = await import('next-intl')
	const [{ default: en }, { default: cs }] = await Promise.all([
		import('../../../messages/en.json'),
		import('../../../messages/cs.json'),
	])

	return {
		getTranslations: async (namespace: HeroNamespace) =>
			create({
				locale: intlState.locale,
				messages: intlState.locale === 'cs' ? cs : en,
				namespace,
			}),
	}
})

// Keep the block test focused on the hero contract rather than next-intl routing.
vi.mock('@/i18n/navigation', () => ({
	Link: ({
		children,
		href,
		...props
	}: {
		children: ReactNode
		href: string
		[key: string]: unknown
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}))

async function renderHero(locale: LocaleId) {
	intlState.locale = locale
	const view = render(await Hero())
	const hero = screen.getByRole('region')

	return { ...view, hero }
}

describe('Home hero', () => {
	beforeEach(() => {
		intlState.locale = 'en'
	})

	it.each(['en', 'cs'] as const)(
		'names Karel Kutchan in the %s identity row without a second heading',
		async (locale) => {
			const { hero } = await renderHero(locale)
			const messages = catalogs[locale]

			const name = within(hero).getByText(messages.home.hero.identity.name)
			expect(name.tagName).toBe('SPAN')
			expect(name.closest('h1, h2, h3, h4, h5, h6')).toBeNull()

			// The identity lives inside the existing eyebrow paragraph, which carries the
			// role and location too, and precedes the headline in DOM order.
			const eyebrow = name.closest('p')
			expect(eyebrow).not.toBeNull()
			expect(eyebrow?.textContent).toContain(messages.home.hero.identity.name)
			expect(eyebrow?.textContent).not.toBe(messages.home.hero.identity.name)

			const headings = within(hero).getAllByRole('heading')
			expect(headings).toHaveLength(1)
			expect(headings[0].tagName).toBe('H1')
			expect(headings[0]).toHaveAttribute('id', 'hero-heading')
			expect(headings[0]).toHaveTextContent(messages.home.hero.headline)
			expect(hero).toHaveAttribute('aria-labelledby', 'hero-heading')
			expect(
				eyebrow!.compareDocumentPosition(headings[0]) & Node.DOCUMENT_POSITION_FOLLOWING,
			).toBeTruthy()
		},
	)

	it.each(['en', 'cs'] as const)(
		'keeps the %s flagship CTA first and makes the second action a direct e-mail',
		async (locale) => {
			const { hero } = await renderHero(locale)
			const messages = catalogs[locale]

			const links = within(hero).getAllByRole('link')
			expect(links).toHaveLength(2)

			const [primary, email] = links
			expect(primary).toHaveAttribute('href', homeLinks.flagshipCase)
			expect(primary).toHaveTextContent(messages.home.hero.primaryCta)
			expect(primary.className).toContain('variant-primary')
			expect(primary.className).toContain('size-large')

			expect(email).toHaveAttribute('href', `mailto:${contact.email}`)
			expect(email).toHaveAttribute('data-contact-method', 'email')
			expect(email).toHaveAccessibleName(contact.email)
			expect(email).not.toHaveAttribute('target')
			expect(email).not.toHaveAttribute('rel')
			expect(email).toHaveClass('inline')

			// Locked decision 6: no third action, and no route link to Experience or Contact.
			expect(within(hero).queryByRole('link', { name: /experience|zkušenosti/i })).toBeNull()
			expect(hero.querySelectorAll('a, button')).toHaveLength(2)
		},
	)

	it('carries no dead secondary-action copy in either catalog', () => {
		for (const messages of Object.values(catalogs)) {
			expect(messages.home.hero).not.toHaveProperty('secondaryCta')
			expect(messages.home.hero.identity.name).toBe('Karel Kutchan')
			expect(messages.home.hero.eyebrow).toContain('<identity>{name}</identity>')
		}
	})
})

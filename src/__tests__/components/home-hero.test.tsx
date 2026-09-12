import { render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Hero from '@/app/[locale]/(frontend)/(pages)/(home)/blocks/hero'
import { homeLinks } from '@/content/profile'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

const catalogs = { cs: csMessages, en: enMessages } as const
type LocaleId = keyof typeof catalogs

const intlState = vi.hoisted(() => ({ locale: 'en' as 'cs' | 'en' }))

/** The Hero only reads this namespace; the mock resolves it from the real catalogs. */
type HeroNamespace = 'home.hero'

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

// Keep the block test focused on the hero contract rather than next-intl routing: the
// mock only reproduces the `as-needed` prefix so the Czech destinations stay checkable.
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
		<a href={intlState.locale === 'cs' ? `/cs${href}` : href} {...props}>
			{children}
		</a>
	),
}))

function localizeHref(locale: LocaleId, href: string) {
	return locale === 'cs' ? `/cs${href}` : href
}

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
		'keeps the %s flagship CTA first and books an intro call second (HP-02)',
		async (locale) => {
			const { hero } = await renderHero(locale)
			const messages = catalogs[locale]

			const links = within(hero).getAllByRole('link')
			expect(links).toHaveLength(2)

			const [primary, secondary] = links
			expect(primary).toHaveAttribute('href', localizeHref(locale, homeLinks.flagshipCase))
			expect(primary).toHaveTextContent(messages.home.hero.primaryCta)
			expect(primary.className).toContain('variant-primary')
			expect(primary.className).toContain('size-large')

			expect(secondary).toHaveAttribute('href', localizeHref(locale, homeLinks.booking))
			expect(secondary).toHaveTextContent(messages.home.hero.secondaryCta)
			expect(secondary.className).toContain('variant-secondary')
			expect(secondary.className).toContain('size-large')
			expect(secondary).not.toHaveAttribute('target')
			expect(secondary).not.toHaveAttribute('rel')

			// Exactly two actions: no e-mail, no route link to Experience or Contact itself.
			expect(hero.querySelector('a[href^="mailto:"]')).toBeNull()
			expect(within(hero).queryByRole('link', { name: /experience|zkušenosti/i })).toBeNull()
			expect(hero.querySelectorAll('a, button')).toHaveLength(2)
		},
	)

	it.each(['en', 'cs'] as const)(
		'states the %s availability under the actions as plain text (HP-03)',
		async (locale) => {
			const { hero } = await renderHero(locale)
			const messages = catalogs[locale]

			const availability = within(hero).getByText(messages.home.hero.availability)
			expect(availability.tagName).toBe('P')
			expect(availability.querySelector('a')).toBeNull()

			const [, secondary] = within(hero).getAllByRole('link')
			expect(
				secondary.compareDocumentPosition(availability) & Node.DOCUMENT_POSITION_FOLLOWING,
			).toBeTruthy()
		},
	)

	it('keeps the hero copy and the shared availability sentence consistent in both catalogs', () => {
		for (const messages of Object.values(catalogs)) {
			expect(messages.home.hero.secondaryCta.trim()).not.toBe('')
			expect(messages.home.hero.identity.name).toBe('Karel Kutchan')
			expect(messages.home.hero.eyebrow).toContain('<identity>{name}</identity>')
			// The same fact is stated on `/contact`; the two copies must not drift.
			expect(messages.contact.hero.availability).toBe(messages.home.hero.availability)
		}
	})
})

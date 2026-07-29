import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import Navigation from '@/app/(frontend)/components/ui/navigation'
import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

const navigationState = vi.hoisted(() => ({
	locale: 'en' as 'cs' | 'en',
	pathname: '/',
}))

vi.mock('@/app/(frontend)/components/theme/ThemeToggle', () => ({
	ThemeToggle: () => <button type="button">Theme</button>,
}))

vi.mock('@/app/(frontend)/components/ui/languageSwitcher', () => ({
	default: () => <div>Language switcher</div>,
}))

vi.mock('@/i18n/navigation', () => ({
	Link: ({
		children,
		href,
		...props
	}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; href: string }) => {
		const localizedHref =
			navigationState.locale === 'cs' ? (href === '/' ? '/cs' : `/cs${href}`) : href

		return (
			<a href={localizedHref} {...props}>
				{children}
			</a>
		)
	},
	usePathname: () => navigationState.pathname,
}))

const catalogs = { cs: csMessages, en: enMessages }

const controls = {
	cs: ['Otevřít nabídku', 'Zavřít nabídku'],
	en: ['Open menu', 'Close menu'],
} as const

const navLabels = {
	cs: {
		about: 'O mně',
		contact: 'Kontakt',
		experience: 'Zkušenosti',
		insights: 'Články',
		work: 'Projekty',
	},
	en: {
		about: 'About',
		contact: 'Contact',
		experience: 'Experience',
		insights: 'Insights',
		work: 'Work',
	},
} as const

function renderNavigation(locale: keyof typeof catalogs, pathname = '/') {
	navigationState.locale = locale
	navigationState.pathname = pathname

	return render(
		<NextIntlClientProvider locale={locale} messages={catalogs[locale]}>
			<Navigation />
		</NextIntlClientProvider>,
	)
}

describe('Navigation icon controls', () => {
	it.each(['en', 'cs'] as const)(
		'renders the %s menu controls as canonical accessible icon buttons',
		(locale) => {
			renderNavigation(locale)

			for (const accessibleName of controls[locale]) {
				const control = screen.getByRole('button', { name: accessibleName, hidden: true })

				expect(control.tagName).toBe('BUTTON')
				expect(control).toHaveAttribute('type', 'button')
				expect(control).toHaveClass('iconButton', 'variant-quiet', 'size-medium')
			}
		},
	)
})

describe('Navigation current-page semantics', () => {
	it.each([
		['en', 'Codeguy – Home', '/'],
		['cs', 'Codeguy – Domů', '/cs'],
	] as const)('marks only the %s homepage logo as current', (locale, homeLabel, href) => {
		const { container } = renderNavigation(locale)
		const homeLink = screen.getByRole('link', { name: homeLabel })

		expect(homeLink).toHaveAttribute('aria-current', 'page')
		expect(homeLink).toHaveAttribute('href', href)
		expect(container.querySelectorAll('a[aria-current="page"]')).toHaveLength(1)
	})

	it.each(['en', 'cs'] as const)(
		'marks both responsive copies of every %s primary destination as current',
		(locale) => {
			for (const [key, label] of Object.entries(navLabels[locale])) {
				const { container, unmount } = renderNavigation(locale, `/${key}`)
				const currentLinks = Array.from(
					container.querySelectorAll<HTMLAnchorElement>('a[aria-current="page"]'),
				)

				expect(currentLinks).toHaveLength(2)
				expect(currentLinks.every((link) => link.textContent === label)).toBe(true)
				const expectedHref = locale === 'cs' ? `/cs/${key}` : `/${key}`
				expect(currentLinks.every((link) => link.getAttribute('href') === expectedHref)).toBe(true)

				unmount()
			}
		},
	)

	it.each(['en', 'cs'] as const)(
		'keeps the %s Work destination current on a nested case-study route',
		(locale) => {
			const { container } = renderNavigation(locale, '/work/energy-customer-portal')
			const currentLinks = Array.from(
				container.querySelectorAll<HTMLAnchorElement>('a[aria-current="page"]'),
			)

			expect(currentLinks).toHaveLength(2)
			expect(currentLinks.every((link) => link.textContent === navLabels[locale].work)).toBe(true)
		},
	)

	it.each(['/workshop', '/curriculum-vitae', '/unknown'])(
		'does not infer a current destination from the unrelated path %s',
		(pathname) => {
			const { container } = renderNavigation('en', pathname)

			expect(container.querySelector('a[aria-current="page"]')).not.toBeInTheDocument()
		},
	)
})

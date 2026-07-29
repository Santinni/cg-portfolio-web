import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import Navigation from '@/app/(frontend)/components/ui/navigation'
import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

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
	}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; href: string }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}))

const catalogs = { cs: csMessages, en: enMessages }

const controls = {
	cs: ['Otevřít nabídku', 'Zavřít nabídku'],
	en: ['Open menu', 'Close menu'],
} as const

describe('Navigation icon controls', () => {
	it.each(['en', 'cs'] as const)(
		'renders the %s menu controls as canonical accessible icon buttons',
		(locale) => {
			render(
				<NextIntlClientProvider locale={locale} messages={catalogs[locale]}>
					<Navigation />
				</NextIntlClientProvider>,
			)

			for (const accessibleName of controls[locale]) {
				const control = screen.getByRole('button', { name: accessibleName, hidden: true })

				expect(control.tagName).toBe('BUTTON')
				expect(control).toHaveAttribute('type', 'button')
				expect(control).toHaveClass('iconButton', 'variant-quiet', 'size-medium')
			}
		},
	)
})

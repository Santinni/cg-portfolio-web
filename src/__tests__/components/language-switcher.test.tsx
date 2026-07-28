import { NextIntlClientProvider } from 'next-intl'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LanguageSwitcher from '@/app/(frontend)/components/ui/languageSwitcher'
import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

const { replaceDocument } = vi.hoisted(() => ({ replaceDocument: vi.fn() }))

vi.mock('@/i18n/documentNavigation', () => ({ replaceDocument }))

vi.mock('@/i18n/navigation', () => ({
	getPathname: ({ href, locale }: { href: string; locale: 'cs' | 'en' }) =>
		locale === 'cs' ? `/cs${href}` : href,
	usePathname: () => '/work',
}))

vi.mock('next/navigation', () => ({
	useSearchParams: () => new URLSearchParams('topic=performance'),
}))

const catalogs = { cs: csMessages, en: enMessages }

function renderSwitcher(locale: keyof typeof catalogs) {
	return render(
		<NextIntlClientProvider locale={locale} messages={catalogs[locale]}>
			<LanguageSwitcher />
		</NextIntlClientProvider>,
	)
}

describe('LanguageSwitcher', () => {
	beforeEach(() => {
		replaceDocument.mockReset()
		window.location.hash = '#details'
	})

	it('announces the English controls and preserves pathname, query and hash', async () => {
		const user = userEvent.setup()
		renderSwitcher('en')

		expect(screen.getByRole('group', { name: 'Choose language' })).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: 'Switch to Czech' }))

		expect(replaceDocument).toHaveBeenCalledWith('/cs/work?topic=performance#details')
	})

	it('renders Czech accessibility copy and switches back to unprefixed English', async () => {
		const user = userEvent.setup()
		renderSwitcher('cs')

		expect(screen.getByRole('group', { name: 'Vyberte jazyk' })).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: 'Přepnout do jazyka: Angličtina' }))

		expect(replaceDocument).toHaveBeenCalledWith('/work?topic=performance#details')
	})
})

import { NextIntlClientProvider } from 'next-intl'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LanguageSwitcher from '@/app/(frontend)/components/ui/languageSwitcher'
import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }))

vi.mock('@/i18n/navigation', () => ({
	usePathname: () => '/work',
	useRouter: () => ({ replace }),
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
		replace.mockReset()
		window.location.hash = '#details'
	})

	it('announces the English controls and preserves pathname, query and hash', async () => {
		const user = userEvent.setup()
		renderSwitcher('en')

		expect(screen.getByRole('group', { name: 'Choose language' })).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: 'Switch to Czech' }))

		expect(replace).toHaveBeenCalledWith('/work?topic=performance#details', { locale: 'cs' })
	})

	it('renders Czech accessibility copy and switches back to unprefixed English', async () => {
		const user = userEvent.setup()
		renderSwitcher('cs')

		expect(screen.getByRole('group', { name: 'Vyberte jazyk' })).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: 'Přepnout do jazyka: Angličtina' }))

		expect(replace).toHaveBeenCalledWith('/work?topic=performance#details', { locale: 'en' })
	})
})

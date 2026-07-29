import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

let desktopMedia: MediaQueryList
let closeDialog: ReturnType<typeof vi.fn>
let showModal: ReturnType<typeof vi.fn>

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

function createMediaQueryList(query: string): MediaQueryList {
	const eventTarget = new EventTarget()
	const addEventListener = eventTarget.addEventListener.bind(
		eventTarget,
	) as MediaQueryList['addEventListener']
	const removeEventListener = eventTarget.removeEventListener.bind(
		eventTarget,
	) as MediaQueryList['removeEventListener']

	return {
		addEventListener,
		addListener: (listener) => {
			if (listener) addEventListener('change', listener)
		},
		dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
		matches: false,
		media: query,
		onchange: null,
		removeEventListener,
		removeListener: (listener) => {
			if (listener) removeEventListener('change', listener)
		},
	}
}

beforeEach(() => {
	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: vi.fn((query: string) => {
			desktopMedia = createMediaQueryList(query)
			return desktopMedia
		}),
	})

	showModal = vi.fn(function (this: HTMLDialogElement) {
		if (this.open) return

		this.setAttribute('open', '')
		this.querySelector<HTMLElement>('button')?.focus()
	})
	closeDialog = vi.fn(function (this: HTMLDialogElement) {
		if (!this.open) return

		this.removeAttribute('open')
	})

	Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
		configurable: true,
		value: showModal,
	})
	Object.defineProperty(HTMLDialogElement.prototype, 'close', {
		configurable: true,
		value: closeDialog,
	})
})

afterEach(() => {
	document.body.style.overflow = ''
	Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
	vi.restoreAllMocks()
})

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

describe('Navigation dialog lifecycle', () => {
	it('guards native open and close calls and restores the previous body overflow', async () => {
		const user = userEvent.setup()
		document.body.style.overflow = 'clip'
		renderNavigation('en')

		const trigger = screen.getByRole('button', { name: 'Open menu' })
		const close = screen.getByRole('button', { name: 'Close menu', hidden: true })

		await user.click(trigger)
		fireEvent.click(trigger)
		await waitFor(() => expect(document.body.style.overflow).toBe('hidden'))
		expect(showModal).toHaveBeenCalledTimes(1)

		await user.click(close)
		fireEvent.click(close)
		await waitFor(() => expect(document.body.style.overflow).toBe('clip'))
		expect(closeDialog).toHaveBeenCalledTimes(1)
		expect(trigger).toHaveAttribute('aria-expanded', 'false')
	})

	it('closes an open menu at the desktop breakpoint without focusing the hidden trigger', async () => {
		const user = userEvent.setup()
		renderNavigation('en')

		const trigger = screen.getByRole('button', { name: 'Open menu' })
		await user.click(trigger)
		expect(screen.getByRole('button', { name: 'Close menu', hidden: true })).toHaveFocus()

		act(() => {
			const event = Object.assign(new Event('change'), {
				matches: true,
				media: desktopMedia.media,
			}) as MediaQueryListEvent
			desktopMedia.dispatchEvent(event)
		})

		expect(closeDialog).toHaveBeenCalledTimes(1)
		expect(trigger).not.toHaveFocus()
		expect(trigger).toHaveAttribute('aria-expanded', 'false')
		await waitFor(() => expect(document.body.style.overflow).toBe(''))
	})

	it('ignores a stale close event after the dialog has reopened', async () => {
		const user = userEvent.setup()
		const { container } = renderNavigation('en')

		const trigger = screen.getByRole('button', { name: 'Open menu' })
		const close = screen.getByRole('button', { name: 'Close menu', hidden: true })
		const dialog = container.querySelector('dialog')

		expect(dialog).not.toBeNull()
		if (!dialog) return

		await user.click(trigger)
		await user.click(close)
		await user.click(trigger)

		fireEvent(dialog, new Event('close'))

		expect(dialog).toHaveAttribute('open')
		expect(trigger).toHaveAttribute('aria-expanded', 'true')
		expect(document.body.style.overflow).toBe('hidden')
	})
})

describe('Navigation scroll surface', () => {
	it('initializes from restored scroll, updates passively and removes its listener', async () => {
		const addEventListener = vi.spyOn(window, 'addEventListener')
		const removeEventListener = vi.spyOn(window, 'removeEventListener')
		Object.defineProperty(window, 'scrollY', { configurable: true, value: 120 })

		const { unmount } = renderNavigation('en')
		const navigation = screen.getByRole('navigation')

		await waitFor(() => expect(navigation).toHaveAttribute('data-scrolled', 'true'))
		expect(addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
			passive: true,
		})

		Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
		fireEvent.scroll(window)
		expect(navigation).toHaveAttribute('data-scrolled', 'false')

		const scrollRegistration = addEventListener.mock.calls.find(([type]) => type === 'scroll')
		expect(scrollRegistration).toBeDefined()

		unmount()
		expect(removeEventListener).toHaveBeenCalledWith('scroll', scrollRegistration?.[1])
	})
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

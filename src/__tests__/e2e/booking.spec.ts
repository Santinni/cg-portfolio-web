import { expect, type Locator, type Page, test } from '@playwright/test'

import {
	expectPx,
	findVisibleDescendantOverflow,
	prepareHomeRender,
	type HomeTheme,
	waitForHomeRender,
} from './support/home-parity'

const calendarUrl =
	'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1C4Xr8kHc-vu8Mr9Yivuejsv52uG4U0TwcpvlKKx68ItOEY9ZN5yiWwbNHOUPMPGqaFHSL8Dbb?gv=true'
const calendarRoutePattern = 'https://calendar.google.com/**'

const bookingLocales = [
	{
		id: 'en',
		path: '/contact/book',
		lang: 'en',
		heroTitle: 'Start with a focused introductory conversation.',
		loadLabel: 'Load Google Calendar',
		loadingLabel: 'Loading Google Calendar…',
		iframeTitle: 'Google Calendar appointment scheduling',
		fallbackTitle: 'Prefer another way to connect?',
		externalLabel: 'Open Google Calendar in a new tab',
		emailLabel: 'Send an email',
		bookingHref: '/contact/book',
	},
	{
		id: 'cs',
		path: '/cs/contact/book',
		lang: 'cs',
		heroTitle: 'Začněme věcným úvodním rozhovorem.',
		loadLabel: 'Načíst Kalendář Google',
		loadingLabel: 'Načítání Kalendáře Google…',
		iframeTitle: 'Rezervace termínu v Kalendáři Google',
		fallbackTitle: 'Dáváte přednost jinému způsobu spojení?',
		externalLabel: 'Otevřít Kalendář Google v nové kartě',
		emailLabel: 'Poslat e-mail',
		bookingHref: '/cs/contact/book',
	},
] as const

const viewports = [
	{ id: '1440', width: 1440, height: 900 },
	{ id: '768', width: 768, height: 1024 },
	{ id: '390', width: 390, height: 844 },
] as const

const themes = ['light', 'dark'] as const satisfies readonly HomeTheme[]

const ctaSources = [
	{ id: 'contact', path: '/contact' },
	{ id: 'experience', path: '/experience' },
	{ id: 'curriculumVitae', path: '/curriculum-vitae' },
	{ id: 'caseStudy', path: '/work/energy-customer-portal' },
] as const

function calendarRequestCount(page: Page, mode: 'abort' | 'fulfill') {
	let requestCount = 0

	return {
		install: () =>
			page.route(calendarRoutePattern, async (route) => {
				requestCount += 1
				if (mode === 'abort') {
					await route.abort('failed')
					return
				}

				await route.fulfill({
					status: 200,
					contentType: 'text/html; charset=utf-8',
					body: '<!doctype html><html lang="en"><body>Stubbed calendar</body></html>',
				})
			}),
		read: () => requestCount,
	}
}

function getLoadButton(page: Page, label: string): Locator {
	return page
		.getByRole('button', { exact: true, name: label })
		.and(page.locator('[data-booking-load]'))
}

async function expectFallbacks(page: Page, locale: (typeof bookingLocales)[number]) {
	await expect(page.getByText(locale.fallbackTitle, { exact: true })).toBeVisible()
	const externalFallback = page
		.getByRole('link', { exact: true, name: locale.externalLabel })
		.and(page.locator('[data-booking-external]'))
	await expect(externalFallback).toBeVisible()
	await expect(externalFallback).toHaveAttribute('href', calendarUrl)

	const emailFallback = page
		.getByRole('link', { exact: true, name: locale.emailLabel })
		.and(page.locator('[data-booking-email]'))
	await expect(emailFallback).toBeVisible()
	await expect(emailFallback).toHaveAttribute('href', 'mailto:karel@codeguy.cz')
}

async function focusByKeyboard(page: Page, target: Locator) {
	await page.evaluate(() => {
		if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
	})

	for (let index = 0; index < 40; index += 1) {
		await page.keyboard.press('Tab')
		if (await target.evaluate((element) => document.activeElement === element)) return
	}

	throw new Error('Could not reach the Google Calendar load button using keyboard navigation')
}

async function gotoBooking(
	page: Page,
	path: string,
	theme: HomeTheme,
	viewport: { width: number; height: number },
) {
	await page.setViewportSize(viewport)
	await prepareHomeRender(page, theme)
	const response = await page.goto(path)
	expect(response?.status(), `${path} should return HTTP 200`).toBe(200)
	await waitForHomeRender(page, theme)
}

async function expectLoadButtonGeometry(button: Locator) {
	const geometry = await button.evaluate((element) => {
		const rect = element.getBoundingClientRect()
		const styles = getComputedStyle(element)
		return {
			borderRadius: styles.borderRadius,
			height: rect.height,
			left: rect.left,
			right: rect.right,
			viewportWidth: document.documentElement.clientWidth,
		}
	})

	expectPx(geometry.height, 52)
	expect(geometry.borderRadius).toBe('4px')
	expect(geometry.left).toBeGreaterThanOrEqual(-0.5)
	expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5)
}

for (const locale of bookingLocales) {
	test.describe(`${locale.id.toUpperCase()} booking`, () => {
		test('renders one localized heading, unique IDs, fallbacks and the required frame policy', async ({
			page,
		}) => {
			const requests = calendarRequestCount(page, 'abort')
			await requests.install()
			const response = await page.goto(locale.path)

			expect(response?.status()).toBe(200)
			expect(new URL(page.url()).pathname).toBe(locale.path)
			await expect(page.locator('html')).toHaveAttribute('lang', locale.lang)

			const h1 = page.getByRole('heading', { level: 1 })
			await expect(h1).toHaveCount(1)
			await expect(h1).toHaveText(locale.heroTitle)

			const duplicateIds = await page.locator('[id]').evaluateAll((elements) => {
				const counts = new Map<string, number>()
				for (const element of elements) counts.set(element.id, (counts.get(element.id) ?? 0) + 1)
				return [...counts.entries()].filter(([, count]) => count > 1)
			})
			expect(duplicateIds).toEqual([])

			expect(requests.read()).toBe(0)
			await expect(page.locator('iframe[data-booking-frame]')).toHaveCount(0)
			await expectFallbacks(page, locale)

			const contentSecurityPolicy = response?.headers()['content-security-policy']
			expect(contentSecurityPolicy).toBeTruthy()
			const frameSourceDirective = contentSecurityPolicy
				?.split(';')
				.map((directive) => directive.trim())
				.find((directive) => directive.startsWith('frame-src '))
			expect(frameSourceDirective?.split(/\s+/)).toEqual(
				expect.arrayContaining(['frame-src', "'self'", 'https://calendar.google.com']),
			)
		})

		for (const activation of ['keyboard', 'click'] as const) {
			test(`${activation} activation loads exactly one locally stubbed localized calendar frame`, async ({
				page,
			}) => {
				const requests = calendarRequestCount(page, 'fulfill')
				await requests.install()
				await page.goto(locale.path)

				expect(requests.read()).toBe(0)
				await expect(page.locator('iframe[data-booking-frame]')).toHaveCount(0)
				await expectFallbacks(page, locale)

				const loadButton = getLoadButton(page, locale.loadLabel)
				if (activation === 'keyboard') {
					await focusByKeyboard(page, loadButton)
					await page.keyboard.press('Enter')
				} else {
					await loadButton.click()
				}

				const frame = page.locator('iframe[data-booking-frame]')
				await expect(frame).toHaveCount(1)
				await expect(frame).toHaveAttribute('title', locale.iframeTitle)
				await expect(frame).toHaveAttribute('src', calendarUrl)
				await expect.poll(requests.read).toBe(1)
				await expectFallbacks(page, locale)
			})
		}

		test('an aborted calendar request keeps both first-party fallbacks available', async ({
			page,
		}) => {
			const requests = calendarRequestCount(page, 'abort')
			await requests.install()
			await page.goto(locale.path)

			const failedRequest = page.waitForEvent('requestfailed', (request) =>
				request.url().startsWith('https://calendar.google.com/'),
			)
			await getLoadButton(page, locale.loadLabel).click()
			await failedRequest

			expect(requests.read()).toBe(1)
			await expect(page.locator('iframe[data-booking-frame]')).toHaveCount(1)
			await expectFallbacks(page, locale)
		})
	})
}

for (const locale of bookingLocales) {
	for (const theme of themes) {
		for (const viewport of viewports) {
			test(`${locale.id} ${theme} booking is contained at ${viewport.id}px`, async ({ page }) => {
				const requests = calendarRequestCount(page, 'abort')
				await requests.install()
				await gotoBooking(page, locale.path, theme, viewport)

				expect(requests.read()).toBe(0)
				expect(
					await findVisibleDescendantOverflow(page, { root: '[data-booking-page]' }),
					`${locale.id}/${theme}/${viewport.id}px visible overflow`,
				).toEqual([])
				await expectLoadButtonGeometry(getLoadButton(page, locale.loadLabel))
			})
		}
	}

	test(`${locale.id} light booking has no visible overflow at 320px`, async ({ page }) => {
		const requests = calendarRequestCount(page, 'abort')
		await requests.install()
		await gotoBooking(page, locale.path, 'light', { width: 320, height: 900 })

		expect(requests.read()).toBe(0)
		expect(
			await findVisibleDescendantOverflow(page, { root: '[data-booking-page]' }),
			`${locale.id}/light/320px visible overflow`,
		).toEqual([])
		await expectLoadButtonGeometry(getLoadButton(page, locale.loadLabel))
	})
}

test('real Tab navigation gives the load button a visible two-pixel focus outline', async ({
	page,
}) => {
	const locale = bookingLocales[0]
	const requests = calendarRequestCount(page, 'abort')
	await requests.install()
	await gotoBooking(page, locale.path, 'light', viewports[0])

	const loadButton = getLoadButton(page, locale.loadLabel)
	await focusByKeyboard(page, loadButton)
	await expect(loadButton).toBeFocused()
	await expectLoadButtonGeometry(loadButton)

	const focusStyles = await loadButton.evaluate((element) => {
		const styles = getComputedStyle(element)
		return {
			color: styles.outlineColor,
			offset: styles.outlineOffset,
			style: styles.outlineStyle,
			width: styles.outlineWidth,
		}
	})
	expect(focusStyles).toEqual({
		color: 'rgb(10, 110, 128)',
		offset: '2px',
		style: 'solid',
		width: '2px',
	})
	expect(requests.read()).toBe(0)
})

for (const locale of bookingLocales) {
	test(`${locale.id.toUpperCase()} contextual booking CTAs resolve to the exact localized route`, async ({
		page,
	}) => {
		for (const source of ctaSources) {
			const localizedPath = locale.id === 'cs' ? `/cs${source.path}` : source.path
			const response = await page.goto(localizedPath)
			expect(response?.status(), `${localizedPath} should return HTTP 200`).toBe(200)

			const cta = page.locator(`[data-booking-source="${source.id}"]`).getByRole('link', {
				exact: true,
				name: locale.id === 'cs' ? 'Domluvit rozhovor' : 'Book a conversation',
			})
			await expect(cta).toHaveCount(1)
			await expect(cta).toHaveAttribute('href', locale.bookingHref)
		}
	})
}

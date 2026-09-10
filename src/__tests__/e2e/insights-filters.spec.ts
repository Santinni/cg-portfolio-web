import { expect, type Page, test } from '@playwright/test'

const filterLocales = {
	cs: {
		labels: ['Vše', 'Architektura', 'Výkon', 'Design systémy', 'Přístupnost'],
		navName: 'Filtrovat články podle tématu',
		path: '/cs/insights',
	},
	en: {
		labels: ['All', 'Architecture', 'Performance', 'Design systems', 'Accessibility'],
		navName: 'Filter insights by topic',
		path: '/insights',
	},
} as const

type FilterLocale = keyof typeof filterLocales

const EMPTY_STATE_COPY = {
	en: {
		noPosts: 'New notes on frontend engineering will appear here after publication.',
		noTopicMatch: 'No published insight currently matches this topic.',
	},
} as const

function filterNavigation(page: Page, locale: FilterLocale) {
	return page.getByRole('navigation', { name: filterLocales[locale].navName })
}

async function expectCurrentFilter(page: Page, locale: FilterLocale, label: string) {
	const navigation = filterNavigation(page, locale)
	const current = navigation.locator('a[aria-current="page"]')

	await expect(current).toHaveCount(1)
	await expect(current).toHaveText(label)
	await expect(navigation.getByRole('link', { name: label })).toHaveAttribute(
		'aria-current',
		'page',
	)
}

async function clickFilterAndExpectLocation(
	page: Page,
	locale: FilterLocale,
	label: string,
	expected: { pathname: string; search: string },
) {
	await Promise.all([
		page.waitForURL((url) => url.pathname === expected.pathname && url.search === expected.search),
		filterNavigation(page, locale).getByRole('link', { name: label }).click(),
	])
	await page.waitForLoadState('load')
}

/** Distinct rounded top edges of the filter items: 1 means one row, 2+ means wrapping. */
function countFilterRows(page: Page, locale: FilterLocale) {
	return filterNavigation(page, locale)
		.getByRole('list')
		.evaluate((list) => {
			const tops = Array.from(list.querySelectorAll(':scope > li')).map((item) =>
				Math.round(item.getBoundingClientRect().top),
			)
			return new Set(tops).size
		})
}

test.describe('Insights topic filters', () => {
	test('render five link controls and reflect the topic query with aria-current', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		const response = await page.goto('/insights?topic=architecture')

		expect(response?.status()).toBe(200)

		const navigation = filterNavigation(page, 'en')
		const links = navigation.getByRole('link')

		await expect(links).toHaveCount(5)
		await expect(links).toHaveText([...filterLocales.en.labels])
		await expect(navigation.getByRole('button')).toHaveCount(0)
		await expect(navigation.locator('[aria-pressed]')).toHaveCount(0)
		await expect(navigation.locator('[role="tablist"]')).toHaveCount(0)

		await expectCurrentFilter(page, 'en', 'Architecture')
		for (const label of filterLocales.en.labels.filter((entry) => entry !== 'Architecture')) {
			await expect(navigation.getByRole('link', { name: label })).not.toHaveAttribute(
				'aria-current',
				'page',
			)
		}
	})

	test('pass the selected topic to the server query, not only to the control state', async ({
		page,
	}) => {
		// The pinned database is empty, so the empty-state copy is the observable
		// difference: a topic filter yields the "no match" message, no filter the
		// "no posts" message. A restyle that dropped `selectedTopic` on the way to
		// `listPublishedPosts` would render the same copy for both.
		await page.goto('/insights?topic=architecture')
		await expect(page.getByText(EMPTY_STATE_COPY.en.noTopicMatch)).toBeVisible()
		await expect(page.getByText(EMPTY_STATE_COPY.en.noPosts)).toHaveCount(0)

		await page.goto('/insights')
		await expect(page.getByText(EMPTY_STATE_COPY.en.noPosts)).toBeVisible()
		await expect(page.getByText(EMPTY_STATE_COPY.en.noTopicMatch)).toHaveCount(0)
	})

	test('keep the selected topic in the URL across navigation, Back and reload', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/insights?topic=architecture')
		await expectCurrentFilter(page, 'en', 'Architecture')

		await clickFilterAndExpectLocation(page, 'en', 'Performance', {
			pathname: '/insights',
			search: '?topic=performance',
		})
		await expectCurrentFilter(page, 'en', 'Performance')

		await page.goBack()
		await page.waitForURL(
			(url) => url.pathname === '/insights' && url.search === '?topic=architecture',
		)
		await expectCurrentFilter(page, 'en', 'Architecture')

		await page.reload()
		expect(new URL(page.url()).search).toBe('?topic=architecture')
		await expectCurrentFilter(page, 'en', 'Architecture')

		await clickFilterAndExpectLocation(page, 'en', 'All', { pathname: '/insights', search: '' })
		await expectCurrentFilter(page, 'en', 'All')
	})

	test('preserve the Czech locale prefix when switching topics', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/cs/insights?topic=performance')

		await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
		await expectCurrentFilter(page, 'cs', 'Výkon')

		await clickFilterAndExpectLocation(page, 'cs', 'Architektura', {
			pathname: '/cs/insights',
			search: '?topic=architecture',
		})
		await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
		await expectCurrentFilter(page, 'cs', 'Architektura')

		await clickFilterAndExpectLocation(page, 'cs', 'Vše', { pathname: '/cs/insights', search: '' })
		await expectCurrentFilter(page, 'cs', 'Vše')
	})

	test('are keyboard reachable with visible focus', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/insights')

		const navigation = filterNavigation(page, 'en')
		const architecture = navigation.getByRole('link', { name: 'Architecture' })
		await navigation.getByRole('link', { name: 'All' }).focus()
		await page.keyboard.press('Tab')
		await expect(architecture).toBeFocused()

		const outline = await architecture.evaluate((element) => {
			const styles = getComputedStyle(element)
			return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) }
		})
		expect(outline.style).not.toBe('none')
		expect(outline.width).toBeGreaterThan(0)

		await Promise.all([
			page.waitForURL((url) => url.search === '?topic=architecture'),
			page.keyboard.press('Enter'),
		])
		await expectCurrentFilter(page, 'en', 'Architecture')
	})

	for (const locale of ['en', 'cs'] as const) {
		test(`wrap into rows without horizontal overflow at 390px (${locale})`, async ({ page }) => {
			await page.setViewportSize({ width: 390, height: 844 })
			await page.goto(filterLocales[locale].path)

			const navigation = filterNavigation(page, locale)
			await expect(navigation.getByRole('link')).toHaveCount(5)
			// Font loading can move a line break; measure only once the fonts settled.
			await page.evaluate(() => document.fonts.ready)

			const geometry = await navigation.getByRole('list').evaluate((element) => ({
				documentClientWidth: document.documentElement.clientWidth,
				documentScrollWidth: document.documentElement.scrollWidth,
				listClientWidth: element.clientWidth,
				listHeight: element.getBoundingClientRect().height,
				listScrollWidth: element.scrollWidth,
			}))

			expect(geometry.listScrollWidth).toBeLessThanOrEqual(geometry.listClientWidth)
			expect(geometry.documentScrollWidth).toBeLessThanOrEqual(geometry.documentClientWidth)
			expect(geometry.listHeight).toBeGreaterThan(44)
			expect(await countFilterRows(page, locale)).toBeGreaterThanOrEqual(2)
		})
	}

	test('sit on one row at 1440px', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/insights')

		await expect(filterNavigation(page, 'en').getByRole('link')).toHaveCount(5)
		expect(await countFilterRows(page, 'en')).toBe(1)
	})
})

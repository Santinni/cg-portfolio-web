import { expect, type Page, test } from '@playwright/test'

import {
	expectPx,
	findVisibleDescendantOverflow,
	HOME_PARITY_VIEWPORTS,
	HOME_SELECTORS,
	prepareHomeRender,
	waitForHomeRender,
} from './support/home-parity'

const principleCopy = {
	cs: {
		compactTitle: 'Dobrá rozhodnutí se musí dát opakovat.',
		compactDescriptions: [
			'Snižuji produktová rizika.',
			'Přístupnost začleňuji do komponent.',
			'Chráním změny, na kterých záleží.',
			'Zviditelňuji kompromisy.',
		],
		desktopDescriptions: [
			'Volím hranice a vzory, které snižují produktová rizika.',
			'Přístupné chování začleňuji přímo do komponent a revizí.',
			'Testy, nástroje a zpětnou vazbu používám tam, kde chrání změnu.',
			'Zviditelňuji kompromisy a pomáhám týmům postupovat s jistotou.',
		],
		desktopTitle: 'Seniorní práce je hlavně o tom, aby se dobrá rozhodnutí dala opakovat.',
	},
	en: {
		compactTitle: 'Good decisions should be repeatable.',
		compactDescriptions: [
			'Reduce product risk.',
			'Build inclusion into components.',
			'Protect the changes that matter.',
			'Make trade-offs visible.',
		],
		desktopDescriptions: [
			'Choose boundaries and patterns that reduce product risk.',
			'Build inclusive behavior into components and reviews.',
			'Use tests, tooling and feedback where they protect change.',
			'Make trade-offs visible and help teams move with confidence.',
		],
		desktopTitle: 'Senior engineering is mostly about making good decisions repeatable.',
	},
} as const

const KNOWN_VIEWPORT_CLIENT_WIDTH_DELTAS = [0, 15] as const

const viewportContracts = [
	{
		columns: 4,
		contentWidth: 1200,
		eyebrowSize: 12,
		eyebrowWidth: 600,
		figmaNode: '6:54',
		headingSize: 48,
		headingWidth: 960,
		itemGap: 12,
		itemTitleSize: 20,
		padding: 96,
		rhythm: 32,
		sectionHeight: 529,
		viewport: HOME_PARITY_VIEWPORTS.desktop,
	},
	{
		columns: 1,
		contentWidth: 672,
		eyebrowSize: 11,
		eyebrowWidth: 672,
		figmaNode: '7:415',
		headingSize: 32,
		headingWidth: 672,
		itemGap: 24,
		itemTitleSize: 19,
		padding: 64,
		rhythm: 24,
		sectionHeight: 610,
		viewport: HOME_PARITY_VIEWPORTS.tablet,
	},
	{
		columns: 1,
		contentWidth: 390,
		eyebrowSize: 11,
		eyebrowWidth: 390,
		figmaNode: '8:231',
		headingSize: 32,
		headingWidth: 390,
		itemGap: 24,
		itemTitleSize: 19,
		padding: 64,
		rhythm: 24,
		sectionHeight: 656,
		viewport: HOME_PARITY_VIEWPORTS.responsive430,
	},
	{
		columns: 1,
		contentWidth: 350,
		eyebrowSize: 11,
		eyebrowWidth: 350,
		figmaNode: '8:125',
		headingSize: 32,
		headingWidth: 350,
		itemGap: 24,
		itemTitleSize: 19,
		padding: 64,
		rhythm: 24,
		sectionHeight: 656,
		viewport: HOME_PARITY_VIEWPORTS.mobile,
	},
	{
		columns: 1,
		contentWidth: 280,
		eyebrowSize: 11,
		eyebrowWidth: 280,
		figmaNode: '8:178',
		headingSize: 32,
		headingWidth: 280,
		itemGap: 24,
		itemTitleSize: 19,
		padding: 64,
		rhythm: 24,
		sectionHeight: 702,
		viewport: HOME_PARITY_VIEWPORTS.responsive320,
	},
] as const

async function readPrinciplesLayout(page: Page) {
	return page.locator(HOME_SELECTORS.principles).evaluate((element) => {
		const container = element.querySelector(':scope > div')
		const eyebrow = container?.querySelector(':scope > p')
		const heading = container?.querySelector('#principles-heading')
		const grid = container?.querySelector(':scope > ul')

		if (
			!(container instanceof HTMLElement) ||
			!(eyebrow instanceof HTMLElement) ||
			!(heading instanceof HTMLElement) ||
			!(grid instanceof HTMLElement)
		) {
			throw new Error('Expected the complete Principles structure')
		}

		const sectionStyles = getComputedStyle(element)
		const eyebrowStyles = getComputedStyle(eyebrow)
		const headingStyles = getComputedStyle(heading)
		const gridStyles = getComputedStyle(grid)
		const itemLayouts = Array.from(grid.children).map((item) => {
			if (!(item instanceof HTMLElement)) throw new Error('Expected a Principles item')
			const title = item.querySelector('h3')
			const description = item.querySelector('p')
			if (!(title instanceof HTMLElement) || !(description instanceof HTMLElement)) {
				throw new Error('Expected each Principle to keep its heading and description')
			}

			const titleStyles = getComputedStyle(title)
			const descriptionStyles = getComputedStyle(description)

			return {
				description: description.getBoundingClientRect().toJSON(),
				descriptionClientHeight: description.clientHeight,
				descriptionFontSize: Number.parseFloat(descriptionStyles.fontSize),
				descriptionFontWeight: descriptionStyles.fontWeight,
				descriptionLineHeight: Number.parseFloat(descriptionStyles.lineHeight),
				descriptionScrollHeight: description.scrollHeight,
				gap: Number.parseFloat(getComputedStyle(item).rowGap),
				item: item.getBoundingClientRect().toJSON(),
				title: title.getBoundingClientRect().toJSON(),
				titleClientHeight: title.clientHeight,
				titleFontSize: Number.parseFloat(titleStyles.fontSize),
				titleFontWeight: titleStyles.fontWeight,
				titleLineHeight: Number.parseFloat(titleStyles.lineHeight),
				titleScrollHeight: title.scrollHeight,
			}
		})

		const eyebrowRect = eyebrow.getBoundingClientRect()
		const headingRect = heading.getBoundingClientRect()
		const gridRect = grid.getBoundingClientRect()

		return {
			alignItems: gridStyles.alignItems,
			container: container.getBoundingClientRect().toJSON(),
			documentClientWidth: document.body.clientWidth,
			documentScrollWidth: document.documentElement.scrollWidth,
			eyebrow: eyebrowRect.toJSON(),
			eyebrowFontSize: Number.parseFloat(eyebrowStyles.fontSize),
			eyebrowFontWeight: eyebrowStyles.fontWeight,
			eyebrowLetterSpacing:
				eyebrowStyles.letterSpacing === 'normal'
					? 0
					: Number.parseFloat(eyebrowStyles.letterSpacing),
			eyebrowLineHeight: Number.parseFloat(eyebrowStyles.lineHeight),
			eyebrowToHeading: headingRect.top - eyebrowRect.bottom,
			grid: gridRect.toJSON(),
			gridColumnGap: Number.parseFloat(gridStyles.columnGap),
			gridRowGap: Number.parseFloat(gridStyles.rowGap),
			heading: headingRect.toJSON(),
			headingFontSize: Number.parseFloat(headingStyles.fontSize),
			headingFontWeight: headingStyles.fontWeight,
			headingLineHeight: Number.parseFloat(headingStyles.lineHeight),
			headingToGrid: gridRect.top - headingRect.bottom,
			items: itemLayouts,
			paddingBlockEnd: Number.parseFloat(sectionStyles.paddingBlockEnd),
			paddingBlockStart: Number.parseFloat(sectionStyles.paddingBlockStart),
			section: element.getBoundingClientRect().toJSON(),
			viewportWidth: window.innerWidth,
		}
	})
}

function expectNaturalSectionHeight(layout: Awaited<ReturnType<typeof readPrinciplesLayout>>) {
	const naturalHeight =
		layout.paddingBlockStart +
		layout.eyebrow.height +
		layout.eyebrowToHeading +
		layout.heading.height +
		layout.headingToGrid +
		layout.grid.height +
		layout.paddingBlockEnd

	expectPx(layout.section.height, naturalHeight, 0.5)
}

function parseRgb(color: string): [number, number, number] {
	const channels = color
		.match(/[\d.]+/g)
		?.slice(0, 3)
		.map(Number)
	if (!channels || channels.length !== 3)
		throw new Error(`Expected an RGB color, received ${color}`)
	return channels as [number, number, number]
}

function contrastRatio(foreground: string, background: string): number {
	const luminance = (color: string) => {
		const [red, green, blue] = parseRgb(color).map((channel) => {
			const normalized = channel / 255
			return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
		})
		return 0.2126 * red + 0.7152 * green + 0.0722 * blue
	}

	const foregroundLuminance = luminance(foreground)
	const backgroundLuminance = luminance(background)
	return (
		(Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
		(Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
	)
}

for (const contract of viewportContracts) {
	test(`matches Principles nodes ${contract.figmaNode} in English and contains Czech at ${contract.viewport.width}px`, async ({
		page,
	}) => {
		await page.setViewportSize(contract.viewport)
		await prepareHomeRender(page)

		const englishResponse = await page.goto('/')
		expect(englishResponse?.status()).toBe(200)
		await waitForHomeRender(page)
		await expect(page.locator('html')).toHaveAttribute('lang', 'en')

		const section = page.locator(HOME_SELECTORS.principles)
		await expect(section).toBeVisible()
		await expect(section.locator('li')).toHaveCount(4)

		const isDesktop = contract.viewport.width >= 1024
		const englishTitle = isDesktop ? principleCopy.en.desktopTitle : principleCopy.en.compactTitle
		await expect(section).toHaveAttribute('aria-labelledby', 'principles-heading')
		await expect(section.getByRole('heading', { level: 2 })).toHaveCount(1)
		await expect(section.getByRole('heading', { level: 3 })).toHaveCount(4)
		await expect(
			section.getByRole('heading', { exact: true, level: 2, name: englishTitle }),
		).toBeVisible()
		for (const description of principleCopy.en.desktopDescriptions) {
			await expect(section.getByText(description, { exact: true })).toBeVisible({
				visible: isDesktop,
			})
		}
		for (const description of principleCopy.en.compactDescriptions) {
			await expect(section.getByText(description, { exact: true })).toBeVisible({
				visible: !isDesktop,
			})
		}

		const englishLayout = await readPrinciplesLayout(page)
		const uniqueColumns = new Set(englishLayout.items.map(({ item }) => Math.round(item.x)))
		const uniqueRows = new Set(englishLayout.items.map(({ item }) => Math.round(item.y)))
		const gutter =
			contract.viewport.width === 1440 ? 120 : contract.viewport.width === 768 ? 48 : 20
		const visibleContentWidth = Math.min(
			contract.contentWidth,
			englishLayout.section.width - 2 * gutter,
		)

		expect(uniqueColumns.size).toBe(contract.columns)
		expect(uniqueRows.size).toBe(contract.columns === 4 ? 1 : 4)
		expect(englishLayout.alignItems).toBe('start')
		expectPx(englishLayout.section.width, englishLayout.documentClientWidth)
		const viewportClientWidthDelta = englishLayout.viewportWidth - englishLayout.documentClientWidth
		expect(KNOWN_VIEWPORT_CLIENT_WIDTH_DELTAS).toContain(Math.round(viewportClientWidthDelta))
		expectPx(englishLayout.container.x - englishLayout.section.x, gutter)
		expectPx(englishLayout.section.right - englishLayout.container.right, gutter)
		expectPx(englishLayout.container.width, visibleContentWidth)
		expectPx(englishLayout.eyebrow.width, Math.min(contract.eyebrowWidth, visibleContentWidth))
		expectPx(englishLayout.heading.width, Math.min(contract.headingWidth, visibleContentWidth))
		expectPx(englishLayout.grid.width, visibleContentWidth)
		expectPx(englishLayout.gridColumnGap, contract.rhythm)
		expectPx(englishLayout.gridRowGap, contract.rhythm)
		expectPx(englishLayout.eyebrowToHeading, contract.rhythm)
		expectPx(englishLayout.headingToGrid, contract.rhythm)
		expectPx(englishLayout.paddingBlockStart, contract.padding)
		expectPx(englishLayout.paddingBlockEnd, contract.padding)
		if (contract.viewport.width > 390 || viewportClientWidthDelta === 0) {
			expectPx(englishLayout.section.height, contract.sectionHeight, 1)
		}
		expectNaturalSectionHeight(englishLayout)
		expectPx(englishLayout.eyebrowFontSize, contract.eyebrowSize)
		expectPx(englishLayout.eyebrowLetterSpacing, 0)
		expectPx(englishLayout.eyebrowLineHeight, contract.eyebrowSize * 1.45, 0.1)
		expect(englishLayout.eyebrowFontWeight).toBe('600')
		expectPx(englishLayout.headingFontSize, contract.headingSize)
		expectPx(englishLayout.headingLineHeight, contract.headingSize * 1.45, 0.1)
		expect(englishLayout.headingFontWeight).toBe('600')
		expect(englishLayout.documentScrollWidth).toBeLessThanOrEqual(englishLayout.documentClientWidth)

		for (const item of englishLayout.items) {
			expectPx(item.gap, contract.itemGap)
			expectPx(item.titleFontSize, contract.itemTitleSize)
			expectPx(item.titleLineHeight, contract.itemTitleSize * 1.45, 0.1)
			expect(item.titleFontWeight).toBe('600')
			expectPx(item.descriptionFontSize, 16)
			expectPx(item.descriptionLineHeight, 16 * 1.45, 0.1)
			expect(item.descriptionFontWeight).toBe('400')
			expectPx(item.title.x, item.description.x)
			expectPx(item.title.width, item.description.width)
			expect(item.titleScrollHeight).toBeLessThanOrEqual(item.titleClientHeight)
			expect(item.descriptionScrollHeight).toBeLessThanOrEqual(item.descriptionClientHeight)
		}

		expect(await findVisibleDescendantOverflow(page, { root: HOME_SELECTORS.principles })).toEqual(
			[],
		)

		const czechResponse = await page.goto('/cs')
		expect(czechResponse?.status()).toBe(200)
		await waitForHomeRender(page)
		await expect(page.locator('html')).toHaveAttribute('lang', 'cs')

		const czechSection = page.locator(HOME_SELECTORS.principles)
		const czechTitle = isDesktop ? principleCopy.cs.desktopTitle : principleCopy.cs.compactTitle
		await expect(czechSection).toHaveAttribute('aria-labelledby', 'principles-heading')
		await expect(czechSection.getByRole('heading', { level: 2 })).toHaveCount(1)
		await expect(czechSection.getByRole('heading', { level: 3 })).toHaveCount(4)
		await expect(
			czechSection.getByRole('heading', { exact: true, level: 2, name: czechTitle }),
		).toBeVisible()
		for (const description of principleCopy.cs.desktopDescriptions) {
			await expect(czechSection.getByText(description, { exact: true })).toBeVisible({
				visible: isDesktop,
			})
		}
		for (const description of principleCopy.cs.compactDescriptions) {
			await expect(czechSection.getByText(description, { exact: true })).toBeVisible({
				visible: !isDesktop,
			})
		}

		const czechLayout = await readPrinciplesLayout(page)
		expectPx(czechLayout.section.width, czechLayout.documentClientWidth)
		const czechViewportClientWidthDelta = czechLayout.viewportWidth - czechLayout.documentClientWidth
		expect(KNOWN_VIEWPORT_CLIENT_WIDTH_DELTAS).toContain(
			Math.round(czechViewportClientWidthDelta),
		)
		expectNaturalSectionHeight(czechLayout)
		expectPx(czechLayout.paddingBlockStart, contract.padding)
		expectPx(czechLayout.paddingBlockEnd, contract.padding)
		const visibleCzechContentWidth = Math.min(
			contract.contentWidth,
			czechLayout.section.width - 2 * gutter,
		)
		expectPx(czechLayout.container.x - czechLayout.section.x, gutter)
		expectPx(czechLayout.section.right - czechLayout.container.right, gutter)
		expectPx(czechLayout.container.width, visibleCzechContentWidth)
		expect(czechLayout.documentScrollWidth).toBeLessThanOrEqual(czechLayout.documentClientWidth)

		for (const item of czechLayout.items) {
			expect(item.titleScrollHeight).toBeLessThanOrEqual(item.titleClientHeight)
			expect(item.descriptionScrollHeight).toBeLessThanOrEqual(item.descriptionClientHeight)
		}
		if (contract.columns === 1) {
			for (let index = 1; index < czechLayout.items.length; index += 1) {
				const previous = czechLayout.items[index - 1].item
				const current = czechLayout.items[index].item
				expect(current.top).toBeGreaterThanOrEqual(previous.bottom + contract.rhythm - 0.5)
			}
		}

		expect(await findVisibleDescendantOverflow(page, { root: HOME_SELECTORS.principles })).toEqual(
			[],
		)
	})
}

for (const theme of ['light', 'dark'] as const) {
	for (const viewport of [HOME_PARITY_VIEWPORTS.desktop, HOME_PARITY_VIEWPORTS.mobile]) {
		test(`keeps the accessible contrast-tone palette in ${theme} at ${viewport.width}px`, async ({
			page,
		}) => {
			await page.setViewportSize(viewport)
			await prepareHomeRender(page, theme)
			const response = await page.goto('/')
			expect(response?.status()).toBe(200)
			await waitForHomeRender(page, theme)

			const colors = await page.locator(HOME_SELECTORS.principles).evaluate((element) => {
				const eyebrow = element.querySelector(':scope > div > p')
				const heading = element.querySelector('#principles-heading')
				const description = element.querySelector('li p')
				const itemTitle = element.querySelector('li h3')
				if (
					!(eyebrow instanceof HTMLElement) ||
					!(heading instanceof HTMLElement) ||
					!(description instanceof HTMLElement) ||
					!(itemTitle instanceof HTMLElement)
				) {
					throw new Error('Expected Principles palette targets')
				}

				return {
					background: getComputedStyle(element).backgroundColor,
					description: getComputedStyle(description).color,
					eyebrow: getComputedStyle(eyebrow).color,
					heading: getComputedStyle(heading).color,
					itemTitle: getComputedStyle(itemTitle).color,
				}
			})

			expect(colors.background).toBe(theme === 'light' ? 'rgb(8, 9, 12)' : 'rgb(21, 26, 34)')
			expect(colors.eyebrow).toBe('rgb(34, 211, 238)')
			expect(colors.heading).toBe('rgb(255, 255, 255)')
			expect(colors.itemTitle).toBe('rgb(255, 255, 255)')
			expect(colors.description).toBe('rgb(154, 166, 178)')
			expect(contrastRatio(colors.eyebrow, colors.background)).toBeGreaterThanOrEqual(4.5)
			expect(contrastRatio(colors.heading, colors.background)).toBeGreaterThanOrEqual(4.5)
			expect(contrastRatio(colors.itemTitle, colors.background)).toBeGreaterThanOrEqual(4.5)
			expect(contrastRatio(colors.description, colors.background)).toBeGreaterThanOrEqual(4.5)
		})
	}
}

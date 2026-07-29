import { expect, test } from '@playwright/test'

import {
	expectPx,
	HOME_PARITY_VIEWPORTS,
	prepareHomeRender,
	waitForHomeRender,
} from './support/home-parity'

const cardKeys = [
	'maintenanceApplications',
	'distributedEnergyPlatform',
	'accessibilityRefactoring',
] as const

const locales = [
	{
		compactSummaries: [
			'Reusable architecture for specialist workflows.',
			'Frontend foundations for an evolving energy product.',
			'Inclusive behavior inside an established product.',
		],
		eyebrow: 'SELECTED WORK',
		heading: 'Complex products. Clear frontend decisions.',
		path: '/',
		pending: 'Case study coming soon',
		readCase: 'Read case',
		wideSummaries: [
			'Reusable frontend architecture for enterprise maintenance workflows.',
			'Frontend foundations for a complex distributed-energy product.',
			'Practical accessibility improvements inside an established product.',
		],
	},
	{
		compactSummaries: [
			'Znovupoužitelná architektura pro odborné pracovní postupy.',
			'Frontendové základy pro vyvíjející se energetický produkt.',
			'Přístupné chování v zavedeném produktu.',
		],
		eyebrow: 'VYBRANÉ PROJEKTY',
		heading: 'Komplexní produkty. Jasná frontendová rozhodnutí.',
		path: '/cs',
		pending: 'Případová studie se připravuje',
		readCase: 'Přečíst studii',
		wideSummaries: [
			'Znovupoužitelná frontendová architektura pro podnikové procesy údržby.',
			'Frontendové základy komplexního produktu pro distribuovanou energetiku.',
			'Praktická zlepšení přístupnosti v zavedeném produktu.',
		],
	},
] as const

const viewports = [
	{
		...HOME_PARITY_VIEWPORTS.desktop,
		selectedWorkNode: '6:35',
		cardHeights: [284, 284, 284],
		cardPadding: 24,
		cardTitleFontSize: 24,
		columns: 3,
		contentGap: 32,
		headingFontSize: 48,
		headingLineHeight: 69.6,
		sectionPadding: 104,
		standard: true,
	},
	{
		...HOME_PARITY_VIEWPORTS.tablet,
		selectedWorkNode: '7:397',
		cardHeights: [284, 284, 284],
		cardPadding: 24,
		cardTitleFontSize: 24,
		columns: 1,
		contentGap: 24,
		headingFontSize: 32,
		headingLineHeight: 46.4,
		sectionPadding: 64,
		standard: true,
	},
	{
		...HOME_PARITY_VIEWPORTS.responsive430,
		selectedWorkNode: '8:213',
		cardHeights: [284, 284, 284],
		cardPadding: 24,
		cardTitleFontSize: 24,
		columns: 1,
		contentGap: 24,
		headingFontSize: 32,
		headingLineHeight: 46.4,
		sectionPadding: 64,
		standard: true,
	},
	{
		...HOME_PARITY_VIEWPORTS.mobile,
		selectedWorkNode: '8:107',
		cardHeights: [284, 284, 284],
		cardPadding: 24,
		cardTitleFontSize: 24,
		columns: 1,
		contentGap: 24,
		headingFontSize: 32,
		headingLineHeight: 46.4,
		sectionPadding: 64,
		standard: true,
	},
	{
		...HOME_PARITY_VIEWPORTS.responsive320,
		selectedWorkNode: '8:160',
		cardHeights: [260, 260, 232],
		cardPadding: 16,
		cardTitleFontSize: 20,
		columns: 1,
		contentGap: 24,
		headingFontSize: 32,
		headingLineHeight: 46.4,
		sectionPadding: 64,
		standard: false,
	},
] as const

for (const locale of locales) {
	test.describe(`Selected Work parity at ${locale.path}`, () => {
		for (const viewport of viewports) {
			test(`matches Figma ${viewport.selectedWorkNode} at ${viewport.width}px`, async ({
				page,
			}) => {
				await page.setViewportSize({ height: viewport.height, width: viewport.width })
				await prepareHomeRender(page)
				const response = await page.goto(locale.path)
				expect(response?.status()).toBe(200)
				await waitForHomeRender(page)

				const section = page.locator('#selected-work')
				const heading = section.getByRole('heading', { level: 2, name: locale.heading })
				const eyebrow = section.getByText(locale.eyebrow, { exact: true })
				const grid = section.getByRole('list')
				const items = grid.getByRole('listitem')

				await expect(section).toHaveAttribute('aria-labelledby', 'selected-work-heading')
				await expect(heading).toHaveAttribute('id', 'selected-work-heading')
				await expect(eyebrow).toHaveCount(1)
				await expect(section.getByRole('heading', { level: 2 })).toHaveCount(1)
				await expect(section.getByRole('heading', { level: 3 })).toHaveCount(3)
				await expect(items).toHaveCount(3)

				const layout = await section.evaluate((element, keys) => {
					const content = element.querySelector('#selected-work-content')
					const headingElement = element.querySelector('#selected-work-heading')
					const eyebrowElement = headingElement?.previousElementSibling
					const gridElement = element.querySelector('ul')
					if (
						!(content instanceof HTMLElement) ||
						!(headingElement instanceof HTMLElement) ||
						!(eyebrowElement instanceof HTMLElement) ||
						!(gridElement instanceof HTMLElement)
					) {
						throw new Error('Expected Selected Work content, eyebrow, heading and grid')
					}

					const cards = keys.map((key) => {
						const article = element.querySelector(`[data-work-key="${key}"]`)
						const item = article?.parentElement
						const title = article?.querySelector('h3')
						if (
							!(article instanceof HTMLElement) ||
							!(item instanceof HTMLElement) ||
							!(title instanceof HTMLElement)
						) {
							throw new Error(`Expected semantic WorkCard for ${key}`)
						}

						const articleStyles = getComputedStyle(article)
						const titleStyles = getComputedStyle(title)
						const firstContent = article.querySelector('p')
						if (!(firstContent instanceof HTMLElement)) {
							throw new Error(`Expected visible card content for ${key}`)
						}
						const articleBox = article.getBoundingClientRect()
						const firstContentBox = firstContent.getBoundingClientRect()
						return {
							article: articleBox.toJSON(),
							articleClientWidth: article.clientWidth,
							articleScrollHeight: article.scrollHeight,
							articleScrollWidth: article.scrollWidth,
							borderRadius: Number.parseFloat(articleStyles.borderStartStartRadius),
							borderColor: articleStyles.borderInlineStartColor,
							borderStyle: articleStyles.borderInlineStartStyle,
							borderWidth: Number.parseFloat(articleStyles.borderInlineStartWidth),
							boxShadow: articleStyles.boxShadow,
							contentInsetBlock: firstContentBox.top - articleBox.top,
							contentInsetInline: firstContentBox.left - articleBox.left,
							contentWidth: firstContentBox.width,
							item: item.getBoundingClientRect().toJSON(),
							titleFontSize: Number.parseFloat(titleStyles.fontSize),
							titleLineHeight: Number.parseFloat(titleStyles.lineHeight),
						}
					})

					const contentStyles = getComputedStyle(content)
					const eyebrowStyles = getComputedStyle(eyebrowElement)
					const gridStyles = getComputedStyle(gridElement)
					const headingStyles = getComputedStyle(headingElement)
					const sectionStyles = getComputedStyle(element)
					return {
						cards,
						columnGap: Number.parseFloat(gridStyles.columnGap),
						content: content.getBoundingClientRect().toJSON(),
						contentGap: Number.parseFloat(contentStyles.rowGap),
						documentClientWidth: document.documentElement.clientWidth,
						documentScrollWidth: document.documentElement.scrollWidth,
						eyebrowColor: eyebrowStyles.color,
						eyebrowFontSize: Number.parseFloat(eyebrowStyles.fontSize),
						grid: gridElement.getBoundingClientRect().toJSON(),
						heading: headingElement.getBoundingClientRect().toJSON(),
						headingFontSize: Number.parseFloat(headingStyles.fontSize),
						headingLineHeight: Number.parseFloat(headingStyles.lineHeight),
						rowGap: Number.parseFloat(gridStyles.rowGap),
						sectionPaddingBottom: Number.parseFloat(sectionStyles.paddingBottom),
						sectionPaddingTop: Number.parseFloat(sectionStyles.paddingTop),
					}
				}, cardKeys)

				expectPx(layout.sectionPaddingTop, viewport.sectionPadding)
				expectPx(layout.sectionPaddingBottom, viewport.sectionPadding)
				expectPx(layout.contentGap, viewport.contentGap)
				expectPx(layout.headingFontSize, viewport.headingFontSize)
				expectPx(layout.headingLineHeight, viewport.headingLineHeight)
				expectPx(layout.eyebrowFontSize, viewport.width >= 1024 ? 12 : 11)
				expect(layout.eyebrowColor).toBe('rgb(10, 110, 128)')
				expectPx(layout.columnGap, 24)
				expectPx(layout.rowGap, 24)
				expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth)

				const uniqueColumns = new Set(layout.cards.map(({ item }) => Math.round(item.x)))
				const uniqueRows = new Set(layout.cards.map(({ item }) => Math.round(item.y)))
				expect(uniqueColumns.size).toBe(viewport.columns)
				expect(uniqueRows.size).toBe(viewport.columns === 3 ? 1 : 3)

				for (const [index, card] of layout.cards.entries()) {
					expectPx(card.article.width, card.item.width)
					expectPx(card.article.height, card.item.height)
					expect(card.articleScrollWidth).toBeLessThanOrEqual(card.articleClientWidth + 1)
					expectPx(card.contentInsetBlock, viewport.cardPadding)
					expectPx(card.contentInsetInline, viewport.cardPadding)
					expectPx(card.contentWidth, card.article.width - 2 * viewport.cardPadding)
					expectPx(card.borderRadius, 8)
					expectPx(card.borderWidth, 1)
					expect(card.borderStyle).toBe('solid')
					expect(card.borderColor).toBe('rgb(216, 222, 232)')
					expect(card.boxShadow).toBe('none')
					expectPx(card.titleFontSize, viewport.cardTitleFontSize)
					expectPx(card.titleLineHeight, viewport.standard ? 32 : 28)
					if (locale.path === '/') expectPx(card.article.height, viewport.cardHeights[index])
					else {
						if (viewport.standard) expect(card.article.height).toBeGreaterThanOrEqual(284)
						expect(card.articleScrollHeight).toBeLessThanOrEqual(card.article.height + 1)
					}
				}

				if (viewport.columns === 3) {
					expectPx(layout.grid.x, layout.content.x)
					expectPx(layout.grid.width, 1152)
					for (const card of layout.cards) expectPx(card.item.width, 368)
				} else {
					expectPx(layout.grid.x, layout.content.x)
					expectPx(layout.grid.width, layout.content.width)
				}

				const expectedSummaries =
					viewport.width >= 1024 ? locale.wideSummaries : locale.compactSummaries
				const hiddenSummaries =
					viewport.width >= 1024 ? locale.compactSummaries : locale.wideSummaries
				for (const summary of expectedSummaries) {
					await expect(section.getByText(summary, { exact: true })).toBeVisible()
				}
				for (const summary of hiddenSummaries) {
					await expect(section.getByText(summary, { exact: true })).toBeHidden()
				}

				await expect(section.getByRole('link', { exact: true, name: locale.readCase })).toHaveCount(
					2,
				)
				const pendingCard = section.locator('[data-work-key="accessibilityRefactoring"]')
				await expect(pendingCard.getByText(locale.pending, { exact: true })).toBeVisible()
				await expect(pendingCard.getByRole('link')).toHaveCount(0)
			})
		}
	})
}

for (const viewport of [HOME_PARITY_VIEWPORTS.desktop, HOME_PARITY_VIEWPORTS.mobile]) {
	test(`uses dark semantic card tokens at ${viewport.width}px`, async ({ page }) => {
		await page.setViewportSize({ height: viewport.height, width: viewport.width })
		await prepareHomeRender(page, 'dark')
		await page.goto('/')
		await waitForHomeRender(page, 'dark')

		const section = page.locator('#selected-work')
		const card = section.locator('[data-work-key="maintenanceApplications"]')
		const colors = await card.evaluate((element) => {
			const root = getComputedStyle(document.documentElement)
			const styles = getComputedStyle(element)
			const eyebrow = element.querySelector('p')
			const summary = Array.from(
				element.querySelectorAll<HTMLElement>('[data-summary-variant]'),
			).find((candidate) => getComputedStyle(candidate).display !== 'none')
			const title = element.querySelector('h3')
			if (
				!(eyebrow instanceof HTMLElement) ||
				!(summary instanceof HTMLElement) ||
				!(title instanceof HTMLElement)
			) {
				throw new Error('Expected visible WorkCard text nodes')
			}

			return {
				actual: {
					background: styles.backgroundColor,
					borderColor: styles.borderInlineStartColor,
					borderStyle: styles.borderInlineStartStyle,
					borderWidth: styles.borderInlineStartWidth,
					boxShadow: styles.boxShadow,
					eyebrow: getComputedStyle(eyebrow).color,
					summary: getComputedStyle(summary).color,
					title: getComputedStyle(title).color,
				},
				tokens: {
					background: root.getPropertyValue('--surface-raised').trim(),
					border: root.getPropertyValue('--border-default').trim(),
					eyebrow: root.getPropertyValue('--action-primary').trim(),
					summary: root.getPropertyValue('--text-secondary').trim(),
					title: root.getPropertyValue('--text-primary').trim(),
				},
			}
		})

		expect(colors.actual).toEqual({
			background: 'rgb(21, 26, 34)',
			borderColor: 'rgb(41, 49, 61)',
			borderStyle: 'solid',
			borderWidth: '1px',
			boxShadow: 'none',
			eyebrow: 'rgb(34, 211, 238)',
			summary: 'rgb(154, 166, 178)',
			title: 'rgb(255, 255, 255)',
		})
		expect(colors.tokens).toEqual({
			background: '#151a22',
			border: '#29313d',
			eyebrow: '#22d3ee',
			summary: '#9aa6b2',
			title: '#fff',
		})

		const action = card.getByRole('link', { exact: true, name: 'Read case' })
		await action.focus()
		await expect(action).toBeFocused()
		const focus = await action.evaluate((element) => {
			const styles = getComputedStyle(element)
			return {
				color: styles.outlineColor,
				style: styles.outlineStyle,
				width: styles.outlineWidth,
			}
		})
		expect(focus).toEqual({ color: 'rgb(34, 211, 238)', style: 'solid', width: '2px' })
	})
}

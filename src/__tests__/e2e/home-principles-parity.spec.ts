import { expect, test } from '@playwright/test'

const locales = ['/', '/cs'] as const

const viewports = [
	{ columns: 4, itemGap: 12, padding: 96, rhythm: 32, height: 900, width: 1440 },
	{ columns: 1, itemGap: 24, padding: 64, rhythm: 24, height: 1024, width: 768 },
	{ columns: 1, itemGap: 24, padding: 64, rhythm: 24, height: 844, width: 390 },
] as const

for (const path of locales) {
	test.describe(`Principles layout at ${path}`, () => {
		for (const viewport of viewports) {
			test(`uses ${viewport.columns} column(s) and approved rhythm at ${viewport.width}px`, async ({
				page,
			}) => {
				await page.setViewportSize(viewport)
				const response = await page.goto(path)
				expect(response?.status()).toBe(200)

				const section = page.locator('#principles')
				const heading = section.locator('#principles-heading')
				const eyebrow = section.locator(':scope > div > p')
				const grid = section.locator('ul')
				const items = grid.locator('li')

				await expect(section).toBeVisible()
				await expect(items).toHaveCount(4)

				const layout = await section.evaluate((element) => {
					const eyebrowElement = element.querySelector(':scope > div > p')
					const headingElement = element.querySelector('#principles-heading')
					const gridElement = element.querySelector('ul')

					if (
						!(eyebrowElement instanceof HTMLElement) ||
						!(headingElement instanceof HTMLElement) ||
						!(gridElement instanceof HTMLElement)
					) {
						throw new Error('Expected the Principles eyebrow, heading and grid')
					}

					const sectionStyles = getComputedStyle(element)
					const gridStyles = getComputedStyle(gridElement)
					const itemLayouts = Array.from(gridElement.children).map((item) => {
						if (!(item instanceof HTMLElement)) throw new Error('Expected a Principles item')
						const title = item.querySelector('h3')
						const description = item.querySelector('p')
						if (!(title instanceof HTMLElement) || !(description instanceof HTMLElement)) {
							throw new Error('Expected each principle to keep its heading and description')
						}

						return {
							description: description.getBoundingClientRect().toJSON(),
							gap: Number.parseFloat(getComputedStyle(item).rowGap),
							item: item.getBoundingClientRect().toJSON(),
							title: title.getBoundingClientRect().toJSON(),
						}
					})

					const eyebrowRect = eyebrowElement.getBoundingClientRect()
					const headingRect = headingElement.getBoundingClientRect()
					const gridRect = gridElement.getBoundingClientRect()

					return {
						alignItems: gridStyles.alignItems,
						documentClientWidth: document.documentElement.clientWidth,
						documentScrollWidth: document.documentElement.scrollWidth,
						eyebrowToHeading: headingRect.top - eyebrowRect.bottom,
						grid: gridRect.toJSON(),
						gridGap: Number.parseFloat(gridStyles.columnGap),
						headingToGrid: gridRect.top - headingRect.bottom,
						items: itemLayouts,
						paddingBlockEnd: Number.parseFloat(sectionStyles.paddingBlockEnd),
						paddingBlockStart: Number.parseFloat(sectionStyles.paddingBlockStart),
					}
				})

				const uniqueColumns = new Set(layout.items.map(({ item }) => Math.round(item.x)))
				const uniqueRows = new Set(layout.items.map(({ item }) => Math.round(item.y)))

				expect(uniqueColumns.size).toBe(viewport.columns)
				expect(uniqueRows.size).toBe(viewport.columns === 4 ? 1 : 4)
				expect(layout.gridGap).toBe(viewport.rhythm)
				expect(layout.alignItems).toBe('start')
				expect(layout.eyebrowToHeading).toBe(viewport.rhythm)
				expect(layout.headingToGrid).toBe(viewport.rhythm)
				expect(layout.paddingBlockStart).toBe(viewport.padding)
				expect(layout.paddingBlockEnd).toBe(viewport.padding)
				expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth)

				for (const item of layout.items) {
					expect(item.gap).toBe(viewport.itemGap)
					expect(item.title.x).toBeCloseTo(item.description.x, 5)
					expect(item.title.width).toBeCloseTo(item.description.width, 5)
				}

				await expect(eyebrow).toBeVisible()
				await expect(heading).toBeVisible()
			})
		}
	})
}

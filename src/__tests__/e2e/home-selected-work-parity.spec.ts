import { expect, test } from '@playwright/test'

const locales = ['/', '/cs'] as const

const viewports = [
	{ columns: 3, height: 900, width: 1440 },
	{ columns: 1, height: 1024, width: 768 },
	{ columns: 1, height: 844, width: 390 },
] as const

for (const path of locales) {
	test.describe(`Selected Work grid at ${path}`, () => {
		for (const viewport of viewports) {
			test(`matches the approved ${viewport.columns}-column layout at ${viewport.width}px`, async ({
				page,
			}) => {
				await page.setViewportSize(viewport)
				const response = await page.goto(path)
				expect(response?.status()).toBe(200)

				const section = page.locator('#selected-work')
				const grid = section.locator('ul')
				const items = grid.locator('li')

				await expect(section).toBeVisible()
				await expect(items).toHaveCount(3)

				const layout = await grid.evaluate((element) => {
					const parent = element.parentElement
					const cards = Array.from(element.children).map((item) => {
						const article = item.querySelector('article')
						if (!(item instanceof HTMLElement) || !(article instanceof HTMLElement)) {
							throw new Error('Expected each Selected Work item to contain an article')
						}

						return {
							article: article.getBoundingClientRect().toJSON(),
							item: item.getBoundingClientRect().toJSON(),
						}
					})

					if (!(parent instanceof HTMLElement)) {
						throw new Error('Expected the Selected Work grid inside a Container')
					}

					const styles = getComputedStyle(element)
					return {
						cards,
						columnGap: Number.parseFloat(styles.columnGap),
						documentClientWidth: document.documentElement.clientWidth,
						documentScrollWidth: document.documentElement.scrollWidth,
						grid: element.getBoundingClientRect().toJSON(),
						parent: parent.getBoundingClientRect().toJSON(),
						rowGap: Number.parseFloat(styles.rowGap),
					}
				})

				const uniqueColumns = new Set(layout.cards.map(({ item }) => Math.round(item.x)))
				const uniqueRows = new Set(layout.cards.map(({ item }) => Math.round(item.y)))

				expect(uniqueColumns.size).toBe(viewport.columns)
				expect(uniqueRows.size).toBe(viewport.columns === 3 ? 1 : 3)
				expect(layout.columnGap).toBe(24)
				expect(layout.rowGap).toBe(24)
				expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth)

				for (const card of layout.cards) {
					expect(card.item.height).toBeGreaterThanOrEqual(284)
					expect(card.article.height).toBeCloseTo(card.item.height, 5)
					expect(card.article.width).toBeCloseTo(card.item.width, 5)
				}

				if (viewport.columns === 3) {
					expect(layout.grid.x).toBeCloseTo(layout.parent.x, 5)
					expect(layout.grid.width).toBe(1152)
					for (const card of layout.cards) expect(card.item.width).toBe(368)
				} else {
					expect(layout.grid.x).toBeCloseTo(layout.parent.x, 5)
					expect(layout.grid.width).toBeCloseTo(layout.parent.width, 5)
					for (const card of layout.cards) {
						expect(card.item.width).toBeCloseTo(layout.grid.width, 5)
					}
				}
			})
		}
	})
}

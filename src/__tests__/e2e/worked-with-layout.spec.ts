import { expect, test } from '@playwright/test'

/**
 * Functional class (every engine): the Worked-with row's layout contract from HP-04
 * (2026-09-23, COD-179) — the column count per tier, equal cells, a centred partial last
 * row and no horizontal overflow. Pixel heights belong to the parity specs; this spec asserts
 * structure only, so it can run on Firefox, WebKit and the mobile project too.
 */
const cases = [
	{ width: 320, columns: 2 },
	{ width: 390, columns: 2 },
	{ width: 430, columns: 2 },
	{ width: 767, columns: 2 },
	{ width: 768, columns: 4 },
	{ width: 1024, columns: 4 },
	{ width: 1279, columns: 4 },
	{ width: 1280, columns: 7 },
	{ width: 1440, columns: 7 },
] as const

for (const { width, columns } of cases) {
	test(`lays the marks out in ${columns} columns at ${width}px`, async ({ page, isMobile }) => {
		test.skip(Boolean(isMobile), 'The mobile project ignores viewport widths set by the test.')
		await page.setViewportSize({ width, height: 900 })
		await page.goto('/')
		const section = page.locator('#worked-with')
		await expect(section).toBeVisible()
		await expect(section.getByRole('img')).toHaveCount(7)

		const geometry = await section.locator('ul > li').evaluateAll((cells) => {
			const list = cells[0].parentElement as HTMLElement
			const listBox = list.getBoundingClientRect()
			const rows = new Map<number, DOMRect[]>()
			for (const cell of cells) {
				const box = cell.getBoundingClientRect()
				const key = Math.round(box.top)
				rows.set(key, [...(rows.get(key) ?? []), box])
			}
			return {
				widths: cells.map((cell) => cell.getBoundingClientRect().width),
				rows: [...rows.values()].map((boxes) => ({
					count: boxes.length,
					left: Math.min(...boxes.map((b) => b.left)) - listBox.left,
					right: listBox.right - Math.max(...boxes.map((b) => b.right)),
				})),
				overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
			}
		})

		expect(geometry.overflow).toBe(false)
		// Equal cells: every width within a pixel of the first.
		for (const w of geometry.widths) expect(Math.abs(w - geometry.widths[0])).toBeLessThan(1)
		expect(geometry.rows.length).toBe(Math.ceil(7 / columns))
		for (const row of geometry.rows.slice(0, -1)) expect(row.count).toBe(columns)
		const last = geometry.rows[geometry.rows.length - 1]
		expect(last.count).toBe(7 - columns * (geometry.rows.length - 1))
		// A partial last row is centred; a full row fills the list from edge to edge.
		expect(Math.abs(last.left - last.right)).toBeLessThan(2)
	})
}

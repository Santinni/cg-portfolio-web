/**
 * Visual regression contract for the localized and global 404 boundaries.
 *
 * Baselines are Chromium-on-Linux pixels from the pinned image in `compose.e2e.yaml`;
 * regenerate them only there (`PLAYWRIGHT_ARGS="not-found-visual --update-snapshots"`),
 * never on a developer machine.
 *
 * Figma frames re-verified 2026-09-11 against the shipped view (file cs38WzlXKY9xfDYBinoKel):
 * desktop light 7:247, tablet light 7:366, mobile light 8:76, responsive QA 215:2025 (320)
 * and 215:2042 (430), desktop dark 214:380, mobile dark 214:388. All seven carry the same
 * hierarchy the route renders: eyebrow, single h1, lead, primary "Return home". One recorded
 * difference, pre-existing and out of this spec's scope: the Figma button has no glyph while
 * both boundaries render `ArrowLeft` before the label.
 */
import { expect, test } from '@playwright/test'

import { prepareHomeRender, type HomeTheme, waitForHomeRender } from './support/home-parity'

const PINNED_VISUAL = process.env.PINNED_VISUAL === 'true'
const viewports = [
	{ height: 900, width: 1440 },
	{ height: 1024, width: 768 },
	{ height: 844, width: 390 },
] as const
const locales = [
	{ id: 'en', path: '/not-a-real-page' },
	{ id: 'cs', path: '/cs/not-a-real-page' },
] as const
const themes: HomeTheme[] = ['light', 'dark']

test.describe('404 visual contract', () => {
	test.skip(!PINNED_VISUAL, 'Visual snapshots run only in the pinned container.')

	for (const locale of locales) {
		for (const theme of themes) {
			for (const viewport of viewports) {
				test(`${locale.id} ${theme} at ${viewport.width}px`, async ({ page, browserName }) => {
					test.skip(browserName !== 'chromium', 'Visual snapshots are Chromium-only.')
					await page.setViewportSize(viewport)
					await prepareHomeRender(page, theme)
					const response = await page.goto(locale.path)

					expect(response?.status()).toBe(404)
					await waitForHomeRender(page, theme)
					await expect(page.locator('main section')).toHaveScreenshot(
						`not-found-${locale.id}-${theme}-${viewport.width}.png`,
					)
				})
			}
		}
	}

	test('global boundary at 1440px', async ({ page, browserName }) => {
		test.skip(browserName !== 'chromium', 'Visual snapshots are Chromium-only.')
		await page.setViewportSize({ height: 900, width: 1440 })
		await prepareHomeRender(page, 'light')
		const response = await page.goto('/xx/not-a-real-subpage')

		expect(response?.status()).toBe(404)
		await waitForHomeRender(page, 'light')
		await expect(page.locator('main section')).toHaveScreenshot(
			'not-found-global-en-light-1440.png',
		)
	})
})

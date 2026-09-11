import { expect, test } from '@playwright/test'

import { prepareHomeRender, type HomeTheme, waitForHomeRender } from './support/home-parity'

/**
 * Pixel baselines for `/curriculum-vitae`.
 *
 * BL-002 refactored the CV onto the shared section and contact primitives with no visual
 * evidence, which the backlog's own Risks section rejects for the page a recruiter is most
 * likely to open.
 *
 * That gap was closed by capturing the page twice -- once from `6cfb61a`, the last commit
 * before the refactor, once from `dev` -- and diffing the two. It found a real regression
 * the whole 32-case functional suite had missed: at 390px the arrow pushed the contact row
 * past its content column and the hero grew 52px. The measurements and the resolution are
 * in `docs/audits/2026-09-03-cv-contact-wrap.md`.
 *
 * The baselines here are not that "before" state. They are the approved design that came out
 * of it, icon density included. Their job from here is forward regression protection: the CV
 * consumes shared primitives that COD-78 and COD-79 both touch.
 *
 * WHY REGIONS, NOT WHOLE PAGES. A full-page baseline fails as one undifferentiated "the
 * images differ" whenever any copy or spacing token anywhere on the page moves. After the
 * second or third false alarm people re-baseline blindly and the test is dead. The matrix
 * below therefore pins the contact block -- the surface this work changed, and where the
 * regression actually lived -- and keeps exactly one whole-page shot as a net for what nobody
 * thought to target. Pixels are the right tool only for what geometry assertions cannot see:
 * colour, tokens, glyphs, borders. Line count and block height belong in
 * `curriculum-vitae.spec.ts`, where a failure can name itself.
 *
 * RE-BASELINING. Only after a deliberate design change, and only together with the decision
 * that authorised it -- `docs/decisions/curriculum-vitae.md` for this page. A baseline updated
 * to make a red suite go green records the bug as the intent. Command:
 *
 *   docker compose -p cg-portfolio-e2e -f compose.e2e.yaml run --rm --build e2e sh -c \
 *     'corepack enable && pnpm install --frozen-lockfile --store-dir /pnpm-store && \
 *      pnpm exec playwright test curriculum-vitae-visual --project=chromium --update-snapshots'
 */

const locales = [
	{ id: 'en', path: '/curriculum-vitae' },
	{ id: 'cs', path: '/cs/curriculum-vitae' },
] as const

const viewports = [
	{ id: '1440', width: 1440, height: 900 },
	{ id: '768', width: 768, height: 1024 },
	{ id: '390', width: 390, height: 844 },
] as const

const themes = ['light', 'dark'] as const satisfies readonly HomeTheme[]

/** The contact block: the brand marks, the e-mail underline and the row gap all live here. */
const CONTACT_BLOCK = '[data-cv-content] address'

/**
 * Only `compose.e2e.yaml` sets this. Do not widen it to a platform check: CI also runs
 * on Linux, but on `ubuntu-latest` with `playwright install --with-deps chromium`
 * (`.github/workflows/ci.yml`), whose font packages are not the ones baked into
 * `mcr.microsoft.com/playwright:v1.62.0-noble`. Text would wrap differently there and
 * every baseline would fail on something that is not a regression.
 */
test.skip(
	process.env.PINNED_VISUAL !== 'true',
	'CV visual baselines run only in the pinned image from compose.e2e.yaml; use pnpm test:e2e:pinned',
)

test.describe('Curriculum Vitae visual baseline', () => {
	test.skip(({ browserName }) => browserName !== 'chromium', 'Baselines are pinned to Chromium')

	for (const locale of locales) {
		for (const theme of themes) {
			for (const viewport of viewports) {
				test(`contact block — ${locale.id} / ${theme} / ${viewport.id}`, async ({ page }) => {
					await page.setViewportSize({ height: viewport.height, width: viewport.width })
					await prepareHomeRender(page, theme)

					const response = await page.goto(locale.path)
					expect(response?.status(), `${locale.path} should return HTTP 200`).toBe(200)
					await waitForHomeRender(page, theme)

					await expect(page.locator(CONTACT_BLOCK)).toHaveScreenshot(
						`cv-contact-${locale.id}-${theme}-${viewport.id}.png`,
					)
				})
			}
		}
	}

	/**
	 * The net. One shot, deliberately not a matrix: it exists to catch what no targeted region
	 * was pointed at, and a second copy of it in every locale and theme would reintroduce
	 * exactly the brittleness the regions above avoid.
	 */
	test('whole page — en / light / 1440', async ({ page }) => {
		await page.setViewportSize({ height: 900, width: 1440 })
		await prepareHomeRender(page, 'light')

		const response = await page.goto('/curriculum-vitae')
		expect(response?.status()).toBe(200)
		await waitForHomeRender(page, 'light')

		await expect(page).toHaveScreenshot('cv-full-en-light-1440.png', { fullPage: true })
	})
})

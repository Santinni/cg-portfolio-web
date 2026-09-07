import { expect, type Locator, type Page, test } from '@playwright/test'

import {
	expectPx,
	findVisibleDescendantOverflow,
	prepareHomeRender,
	type HomeTheme,
	waitForHomeRender,
} from './support/home-parity'

const cvLocales = [
	{
		id: 'en',
		path: '/curriculum-vitae',
		lang: 'en',
		heroEyebrow: 'CURRICULUM VITAE',
		heroRole: 'Senior Frontend Engineer',
		currentRole: 'Current role',
		contactLocation: 'Prague, Czechia',
		downloadAccessibleName: 'Download CV — Karel Kutchan',
		pdfHref: '/curriculum-vitae/CV_Karel_Kutchan.pdf',
		filename: 'CV_Karel_Kutchan.pdf',
		sections: [
			{
				id: 'cv-profile',
				heading: 'Senior frontend engineering with increasing product and team ownership.',
			},
			{ id: 'cv-skills', heading: 'Tools and practices used in delivery.' },
			{ id: 'cv-experience', heading: 'Experience' },
			{
				id: 'cv-projects',
				heading: 'Representative work across products, platforms and teams.',
			},
			{ id: 'cv-education', heading: 'Education' },
			{ id: 'cv-download', heading: 'Download CV' },
		],
	},
	{
		id: 'cs',
		path: '/cs/curriculum-vitae',
		lang: 'cs',
		heroEyebrow: 'ŽIVOTOPIS',
		heroRole: 'Senior frontend engineer',
		currentRole: 'Aktuální role',
		contactLocation: 'Praha, Česká republika',
		downloadAccessibleName: 'Stáhnout životopis Karla Kutchana',
		pdfHref: '/curriculum-vitae/CV_Karel_Kutchan_CS.pdf',
		filename: 'CV_Karel_Kutchan_CS.pdf',
		sections: [
			{
				id: 'cv-profile',
				heading: 'Seniorní frontendová práce s rostoucí odpovědností za produkt i tým.',
			},
			{ id: 'cv-skills', heading: 'Nástroje a postupy používané při dodávce.' },
			{ id: 'cv-experience', heading: 'Pracovní zkušenosti' },
			{
				id: 'cv-projects',
				heading: 'Reprezentativní práce napříč produkty, platformami a týmy.',
			},
			{ id: 'cv-education', heading: 'Vzdělání' },
			{ id: 'cv-download', heading: 'Stáhnout životopis' },
		],
	},
] as const

const primaryViewports = [
	{ id: '1440', width: 1440, height: 900 },
	{ id: '768', width: 768, height: 1024 },
	{ id: '390', width: 390, height: 844 },
] as const

const compactOverflowViewports = [
	{ id: '430', width: 430, height: 932 },
	{ id: '320', width: 320, height: 900 },
] as const

const themes = ['light', 'dark'] as const satisfies readonly HomeTheme[]

/**
 * The two methods that render as a brand mark instead of text. Their labels are platform
 * names, so both catalogs carry the same string -- see `messages/*.json` `contact.methods`.
 */
const externalProfiles = [
	{ label: 'LinkedIn', method: 'linkedin' },
	{ label: 'GitHub', method: 'github' },
] as const

const themeColors = {
	light: {
		defaultBackground: 'rgb(10, 110, 128)',
		hoverBackground: 'rgb(8, 90, 106)',
		focus: 'rgb(10, 110, 128)',
	},
	dark: {
		defaultBackground: 'rgb(34, 211, 238)',
		hoverBackground: 'rgb(103, 232, 249)',
		focus: 'rgb(34, 211, 238)',
	},
} as const

function getFloatingDownload(page: Page, label: string): Locator {
	return page
		.locator('[data-cv-download="floating"]')
		.getByRole('link', { exact: true, name: label })
}

function getFooterDownload(page: Page, label: string): Locator {
	return page.locator('[data-cv-download="footer"]').getByRole('link', { exact: true, name: label })
}

async function gotoCv(
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

async function readActionGeometry(action: Locator) {
	return action.evaluate((element) => {
		const label = element.querySelector('span')
		if (!(label instanceof HTMLElement)) throw new Error('Expected a Download Action label')

		const rect = element.getBoundingClientRect()
		const styles = getComputedStyle(element)
		const labelStyles = getComputedStyle(label)

		return {
			backgroundColor: styles.backgroundColor,
			borderRadius: styles.borderRadius,
			bottom: rect.bottom,
			height: rect.height,
			labelMaxInlineSize: Number.parseFloat(labelStyles.maxInlineSize),
			labelOpacity: Number.parseFloat(labelStyles.opacity),
			left: rect.left,
			right: rect.right,
			top: rect.top,
			viewportHeight: window.innerHeight,
			viewportWidth: document.documentElement.clientWidth,
			width: rect.width,
		}
	})
}

async function focusByKeyboard(page: Page, target: Locator) {
	await page.evaluate(() => {
		if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
	})

	for (let index = 0; index < 80; index += 1) {
		await page.keyboard.press('Tab')
		if (await target.evaluate((element) => document.activeElement === element)) return
	}

	throw new Error('Could not reach the target element using keyboard navigation')
}

for (const locale of cvLocales) {
	test.describe(`${locale.id.toUpperCase()} Curriculum Vitae`, () => {
		test('renders the localized semantic route and locale-specific download targets', async ({
			page,
		}) => {
			const response = await page.goto(locale.path)

			expect(response?.status()).toBe(200)
			expect(new URL(page.url()).pathname).toBe(locale.path)
			await expect(page.locator('html')).toHaveAttribute('lang', locale.lang)
			await expect(page.getByText(locale.heroEyebrow, { exact: true })).toBeVisible()
			await expect(page.getByText(locale.heroRole, { exact: true })).toBeVisible()
			await expect(page.getByText(locale.currentRole, { exact: true })).toBeVisible()

			const h1 = page.locator('[data-cv-content] h1')
			await expect(h1).toHaveCount(1)
			await expect(h1).toHaveText('Karel Kutchan')

			const sectionSelector = locale.sections.map(({ id }) => `#${id}`).join(', ')
			const sectionContract = await page.locator(sectionSelector).evaluateAll((sections) =>
				sections.map((section) => ({
					heading: section.querySelector('h2')?.textContent?.trim() ?? null,
					id: section.id,
				})),
			)
			expect(sectionContract).toEqual(locale.sections)

			const duplicateIds = await page.locator('[id]').evaluateAll((elements) => {
				const counts = new Map<string, number>()
				for (const element of elements) counts.set(element.id, (counts.get(element.id) ?? 0) + 1)
				return [...counts.entries()].filter(([, count]) => count > 1)
			})
			expect(duplicateIds).toEqual([])

			await expect(page.getByRole('link', { name: 'karel@codeguy.cz' })).toHaveAttribute(
				'href',
				'mailto:karel@codeguy.cz',
			)
			const footerDownload = getFooterDownload(page, locale.downloadAccessibleName)
			await expect(footerDownload).toHaveAttribute('href', locale.pdfHref)
			await expect(getFloatingDownload(page, locale.downloadAccessibleName)).toHaveAttribute(
				'href',
				locale.pdfHref,
			)
		})

		test('renders the shared contact contract in the hero', async ({ page }) => {
			await page.goto(locale.path)

			const rows = page.locator('[data-cv-content] address [data-contact-method]')
			const contract = await rows.evaluateAll((elements) =>
				elements.map((element) => ({
					href: element.getAttribute('href'),
					method: element.getAttribute('data-contact-method'),
					rel: element.getAttribute('rel'),
					tag: element.tagName,
					target: element.getAttribute('target'),
					text: element.textContent?.trim() ?? '',
				})),
			)

			expect(contract).toEqual([
				{
					href: null,
					method: 'location',
					rel: null,
					tag: 'DIV',
					target: null,
					text: locale.contactLocation,
				},
				{
					href: 'mailto:karel@codeguy.cz',
					method: 'email',
					rel: null,
					tag: 'A',
					target: null,
					text: 'karel@codeguy.cz',
				},
				{
					href: 'https://www.linkedin.com/in/karelkutchan/',
					method: 'linkedin',
					rel: 'noopener noreferrer',
					tag: 'A',
					target: '_blank',
					text: 'LinkedIn',
				},
				{
					href: 'https://github.com/Santinni',
					method: 'github',
					rel: 'noopener noreferrer',
					tag: 'A',
					target: '_blank',
					text: 'GitHub',
				},
			])

			const targetSizes = await rows.evaluateAll((elements) =>
				elements.map((element) => ({
					height: element.getBoundingClientRect().height,
					method: element.getAttribute('data-contact-method'),
					width: element.getBoundingClientRect().width,
				})),
			)
			for (const { height, method, width } of targetSizes) {
				expect(height, `${method} target height`).toBeGreaterThanOrEqual(44)
				expect(width, `${method} target width`).toBeGreaterThanOrEqual(44)
			}
		})

		test('renders external profiles as an icon-only brand target at every width', async ({
			page,
		}) => {
			// Every width the design claims, not just the ones that were convenient: dropping the
			// width switch means no viewport is a special case, and 320 is the width the decision
			// record names as the lower bound.
			const widths = [...primaryViewports, ...compactOverflowViewports]

			for (const viewport of widths) {
				await gotoCv(page, locale.path, 'light', viewport)

				// Both profiles, not just the first one: a swapped ternary in BrandGlyph or a
				// dropped key in hasBrandGlyph would otherwise leave the suite green.
				for (const profile of externalProfiles) {
					const link = page.locator(
						`[data-cv-content] address a[data-contact-method="${profile.method}"]`,
					)
					const label = link.getByText(profile.label, { exact: true })
					const brandGlyph = link.locator('[data-contact-glyph="brand"]')
					const where = `${profile.method} @ ${viewport.id}px`

					// The accessible name is the assertion that matters: `display: none` would take
					// the label out of the accessibility tree, which the clipped label avoids.
					await expect(link, where).toHaveAccessibleName(profile.label)
					await expect(brandGlyph, where).toBeVisible()
					await expect(link.locator('svg'), where).toHaveCount(1)

					// `boundingBox()` returns null for a `display: none` element, so the null case
					// must fail rather than coalesce to a passing zero -- that is the exact
					// substitution this assertion exists to catch.
					const labelBox = await label.boundingBox()
					expect(labelBox, `${where}: clipped label must still occupy a box`).not.toBeNull()
					expect(
						labelBox?.width,
						`${where}: clipped label must not occupy layout`,
					).toBeLessThanOrEqual(1)

					const iconTarget = await link.boundingBox()
					expect(iconTarget, `${where}: target must be laid out`).not.toBeNull()
					expectPx(iconTarget?.height ?? 0, 44)
					expectPx(iconTarget?.width ?? 0, 44)
				}
			}
		})

		for (const theme of themes) {
			test(`shows a visible ${theme} focus ring on the icon-only profile target`, async ({
				page,
			}) => {
				// Without a visible label, the focus ring is the only thing telling a keyboard user
				// where they are -- and dark resolves it through a different token.
				await gotoCv(page, locale.path, theme, primaryViewports[0])

				for (const profile of externalProfiles) {
					const link = page.locator(
						`[data-cv-content] address a[data-contact-method="${profile.method}"]`,
					)
					await focusByKeyboard(page, link)
					await expect(link, profile.method).toBeFocused()

					const outline = await link.evaluate((element) => {
						const styles = getComputedStyle(element)
						return {
							outlineColor: styles.outlineColor,
							outlineStyle: styles.outlineStyle,
							outlineWidth: styles.outlineWidth,
						}
					})

					expect(outline, profile.method).toEqual({
						outlineColor: themeColors[theme].focus,
						outlineStyle: 'solid',
						outlineWidth: '2px',
					})
				}
			})
		}

		test('labels every shared CV section by its own heading', async ({ page }) => {
			await page.goto(locale.path)

			const labelling = await page
				.locator('#cv-profile, #cv-skills, #cv-experience, #cv-projects, #cv-education')
				.evaluateAll((sections) =>
					sections.map((section) => ({
						headingId: section.querySelector('h2')?.id ?? null,
						id: section.id,
						labelledBy: section.getAttribute('aria-labelledby'),
					})),
				)

			expect(labelling).toHaveLength(5)
			for (const { headingId, id, labelledBy } of labelling) {
				expect(labelledBy).toBe(`${id}-heading`)
				expect(headingId).toBe(labelledBy)
			}
		})

		test('downloads the locale-specific PDF without leaving the route', async ({ page }) => {
			await page.goto(locale.path)
			const pathnameBeforeDownload = new URL(page.url()).pathname
			const footerDownload = getFooterDownload(page, locale.downloadAccessibleName)

			const downloadPromise = page.waitForEvent('download')
			await footerDownload.click()
			const download = await downloadPromise

			try {
				expect(download.suggestedFilename()).toBe(locale.filename)
				expect(new URL(page.url()).pathname).toBe(pathnameBeforeDownload)
			} finally {
				await download.delete()
			}
		})
	})
}

for (const locale of cvLocales) {
	test(`serves the ${locale.id.toUpperCase()} PDF directly with the PDF MIME type`, async ({
		request,
	}) => {
		const response = await request.get(locale.pdfHref, { maxRedirects: 0 })

		try {
			expect(response.status()).toBe(200)
			expect(response.headers().location).toBeUndefined()
			expect(response.headers()['content-type']).toMatch(/^application\/pdf(?:;|$)/i)
		} finally {
			await response.dispose()
		}
	})
}

for (const locale of cvLocales) {
	for (const theme of themes) {
		for (const viewport of primaryViewports) {
			test(`${locale.id} ${theme} CV is contained at ${viewport.id}px`, async ({ page }) => {
				await gotoCv(page, locale.path, theme, viewport)
				await expect(page.locator('html')).toHaveAttribute('lang', locale.lang)

				const overflow = await findVisibleDescendantOverflow(page, { root: '[data-cv-content]' })
				expect(overflow, `${locale.id}/${theme}/${viewport.id}px visible overflow`).toEqual([])

				const action = getFloatingDownload(page, locale.downloadAccessibleName)
				await expect(action).toBeVisible()
				const geometry = await readActionGeometry(action)
				expectPx(geometry.height, 52)
				expect(geometry.borderRadius).toBe('4px')
				expect(geometry.backgroundColor).toBe(themeColors[theme].defaultBackground)
				expect(geometry.left).toBeGreaterThanOrEqual(-0.5)
				expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5)
				expect(geometry.top).toBeGreaterThanOrEqual(-0.5)
				expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight + 0.5)
			})
		}
	}

	for (const viewport of compactOverflowViewports) {
		test(`${locale.id} light CV has no visible overflow at ${viewport.id}px`, async ({ page }) => {
			await gotoCv(page, locale.path, 'light', viewport)
			const overflow = await findVisibleDescendantOverflow(page, { root: '[data-cv-content]' })
			expect(overflow, `${locale.id}/light/${viewport.id}px visible overflow`).toEqual([])

			const geometry = await readActionGeometry(
				getFloatingDownload(page, locale.downloadAccessibleName),
			)
			expectPx(geometry.height, 52)
			expect(geometry.borderRadius).toBe('4px')
			expect(geometry.left).toBeGreaterThanOrEqual(-0.5)
			expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5)
		})
	}
}

for (const theme of themes) {
	test(`fine-pointer ${theme} hover expands left and keeps the Download Action anchored`, async ({
		isMobile,
		page,
	}) => {
		// The hover expansion is a fine-pointer affordance, so the touch project has nothing to
		// assert. Without this the test fails there on its own precondition -- which CI never sees,
		// because it runs Chromium alone. The assertion below still proves the desktop projects
		// really do report a fine pointer, so the test cannot quietly become a no-op.
		test.skip(Boolean(isMobile), 'Hover expansion needs a fine pointer; this project has none')

		const locale = cvLocales[0]
		await gotoCv(page, locale.path, theme, primaryViewports[0])
		expect(
			await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches),
		).toBe(true)

		const action = getFloatingDownload(page, locale.downloadAccessibleName)
		await page.mouse.move(0, 0)
		const initial = await readActionGeometry(action)
		expect(initial.backgroundColor).toBe(themeColors[theme].defaultBackground)

		await action.hover()
		await expect
			.poll(() => readActionGeometry(action))
			.toMatchObject({
				backgroundColor: themeColors[theme].hoverBackground,
				labelOpacity: 1,
			})

		const hovered = await readActionGeometry(action)
		expect(hovered.labelMaxInlineSize).toBeGreaterThan(0)
		expect(hovered.width).toBeGreaterThan(initial.width)
		expect(hovered.left).toBeLessThan(initial.left)
		expectPx(hovered.right, initial.right)
		expectPx(hovered.bottom, initial.bottom)
		expectPx(hovered.height, 52)
	})

	test(`real Tab navigation reaches the fixed ${theme} Download Action with visible focus`, async ({
		page,
	}) => {
		const locale = cvLocales[0]
		await gotoCv(page, locale.path, theme, primaryViewports[0])
		const action = getFloatingDownload(page, locale.downloadAccessibleName)

		await focusByKeyboard(page, action)
		await expect(action).toBeFocused()
		const focusContract = await action.evaluate((element) => {
			const label = element.querySelector('span')
			if (!(label instanceof HTMLElement)) throw new Error('Expected a Download Action label')
			const styles = getComputedStyle(element)
			return {
				labelOpacity: getComputedStyle(label).opacity,
				outlineColor: styles.outlineColor,
				outlineStyle: styles.outlineStyle,
				outlineWidth: styles.outlineWidth,
			}
		})

		expect(focusContract).toEqual({
			labelOpacity: '1',
			outlineColor: themeColors[theme].focus,
			outlineStyle: 'solid',
			outlineWidth: '2px',
		})
	})
}

test('reduced motion removes Download Action and label transitions', async ({ page }) => {
	const locale = cvLocales[0]
	await page.setViewportSize(primaryViewports[0])
	await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
	await page.addInitScript(() => localStorage.setItem('codeguy-theme', 'light'))
	const response = await page.goto(locale.path)
	expect(response?.status()).toBe(200)
	await waitForHomeRender(page, 'light')

	const transitionDurations = await getFloatingDownload(
		page,
		locale.downloadAccessibleName,
	).evaluate((element) => {
		const label = element.querySelector('span')
		if (!(label instanceof HTMLElement)) throw new Error('Expected a Download Action label')

		const maxTimeMs = (value: string) =>
			Math.max(
				...value.split(',').map((time) => {
					const normalized = time.trim()
					return normalized.endsWith('ms')
						? Number.parseFloat(normalized)
						: Number.parseFloat(normalized) * 1000
				}),
			)

		return {
			actionMs: maxTimeMs(getComputedStyle(element).transitionDuration),
			labelMs: maxTimeMs(getComputedStyle(label).transitionDuration),
			reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
		}
	})

	expect(transitionDurations.reducedMotion).toBe(true)
	expect(transitionDurations.actionMs).toBeLessThanOrEqual(0.0011)
	expect(transitionDurations.labelMs).toBeLessThanOrEqual(0.0011)
})

test('a separate touch context exposes a stable coarse-pointer Download Action label', async ({
	browser,
}, testInfo) => {
	const baseURL = testInfo.project.use.baseURL
	if (typeof baseURL !== 'string') throw new Error('Playwright baseURL must be configured')

	const context = await browser.newContext({
		baseURL,
		hasTouch: true,
		viewport: { width: 390, height: 844 },
	})

	try {
		const page = await context.newPage()
		await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
		await page.addInitScript(() => localStorage.setItem('codeguy-theme', 'light'))
		const locale = cvLocales[1]
		const response = await page.goto(locale.path)
		expect(response?.status()).toBe(200)
		await waitForHomeRender(page, 'light')

		expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true)
		const action = getFloatingDownload(page, locale.downloadAccessibleName)
		const geometry = await readActionGeometry(action)
		expect(geometry.labelOpacity).toBe(1)
		expect(geometry.labelMaxInlineSize).toBeGreaterThan(0)
		expect(geometry.width).toBeGreaterThan(52)
		expect(geometry.left).toBeGreaterThanOrEqual(-0.5)
		expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 0.5)
	} finally {
		await context.close()
	}
})

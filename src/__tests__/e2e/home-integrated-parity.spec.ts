import { expect, type Page, test } from '@playwright/test'
import {
	expectLineWrapGrowth,
	expectPx,
	findVisibleDescendantOverflow,
	HOME_ORDERED_SECTION_CONTRACTS,
	HOME_PARITY_LOCALES,
	HOME_PARITY_VIEWPORTS,
	type HomeGeometry,
	type HomeGeometryRect,
	prepareHomeRender,
	readHomeGeometry,
	waitForHomeRender,
} from './support/home-parity'

const matrixViewports = [
	HOME_PARITY_VIEWPORTS.desktop,
	HOME_PARITY_VIEWPORTS.tablet,
	HOME_PARITY_VIEWPORTS.responsive430,
	HOME_PARITY_VIEWPORTS.mobile,
	HOME_PARITY_VIEWPORTS.responsive320,
] as const

const LOCAL_WORKING_TREE_REVISION = 'local-working-tree-uncommitted'
const RESERVED_SCROLLBAR_GUTTER = 15

interface RevisionEnvironment {
	APP_REVISION?: string
	GITHUB_SHA?: string
}

function resolveEvidenceRevision(
	environment: RevisionEnvironment = {
		APP_REVISION: process.env.APP_REVISION,
		GITHUB_SHA: process.env.GITHUB_SHA,
	},
) {
	return environment.APP_REVISION || environment.GITHUB_SHA || LOCAL_WORKING_TREE_REVISION
}

const FIGMA_EN_INTEGRATED_GEOMETRY = {
	1440: {
		mainHeight: 3725,
		sections: [
			{ height: 801, top: 0 },
			{ height: 635, top: 801 },
			{ height: 713, top: 1436 },
			{ height: 529, top: 2149 },
			{ height: 565, top: 2678 },
			{ height: 482, top: 3243 },
		],
	},
	768: {
		mainHeight: 3090,
		sections: [
			{ height: 640, top: 0 },
			{ height: 364, top: 640 },
			{ height: 1184, top: 1004 },
			{ height: 610, top: 2188 },
			{ height: 292, top: 2798 },
		],
	},
	430: {
		mainHeight: 3486,
		sections: [
			{ height: 831, top: 0 },
			{ height: 435, top: 831 },
			{ height: 1184, top: 1266 },
			{ height: 656, top: 2450 },
			{ height: 380, top: 3106 },
		],
	},
	390: {
		mainHeight: 3532,
		sections: [
			{ height: 831, top: 0 },
			{ height: 435, top: 831 },
			{ height: 1230, top: 1266 },
			{ height: 656, top: 2496 },
			{ height: 380, top: 3152 },
		],
	},
	320: {
		mainHeight: 3484,
		sections: [
			{ height: 834, top: 0 },
			{ height: 460, top: 834 },
			{ height: 1176, top: 1294 },
			{ height: 702, top: 2470 },
			{ height: 312, top: 3172 },
		],
	},
} as const

function annotateEvidence(viewport: (typeof matrixViewports)[number]) {
	test.info().annotations.push(
		{ type: 'figma-node', description: viewport.figmaNode },
		{
			type: 'app-revision',
			description: resolveEvidenceRevision(),
		},
	)
}

function annotateBrowserTopology(geometry: HomeGeometry, viewportWidth: number) {
	const reservedScrollbarGutter = geometry.document.clientWidth - geometry.document.bodyClientWidth
	test.info().annotations.push({
		type: 'browser-topology',
		description: `viewport=${viewportWidth};document-client=${geometry.document.clientWidth};body-client=${geometry.document.bodyClientWidth};reserved-scrollbar-gutter=${reservedScrollbarGutter}`,
	})
}

function expectEnglishFigmaGeometry(geometry: HomeGeometry, viewportWidth: number) {
	const target =
		FIGMA_EN_INTEGRATED_GEOMETRY[viewportWidth as keyof typeof FIGMA_EN_INTEGRATED_GEOMETRY]
	const visible = geometry.children.filter((child) => child.visible)
	const reservedScrollbarGutter = geometry.document.clientWidth - geometry.document.bodyClientWidth
	expect(geometry.document.clientWidth).toBe(viewportWidth)
	expect([0, RESERVED_SCROLLBAR_GUTTER]).toContain(reservedScrollbarGutter)

	const roundingTolerance = viewportWidth === 1440 ? 0.5 : viewportWidth === 768 ? 1.5 : 2.5
	// A reserved scrollbar gutter narrows the content box, so any section holding
	// copy may rewrap. Which ones actually do is font-metric dependent: at 390px
	// the Hero gains a line on the CI Linux image while Principles does not, and
	// on Windows it is the other way round. Enumerating the sections that wrapped
	// on one machine encodes that machine into the contract, so under a gutter
	// every section is measured as "Figma height plus a whole number of its own
	// line boxes" instead. Without a gutter the exact Figma height still applies.
	const contentBoxIsNarrowed = reservedScrollbarGutter === RESERVED_SCROLLBAR_GUTTER

	let cumulativeMeasuredDelta = 0
	for (const [index, section] of visible.entries()) {
		const expected = target.sections[index]
		expectPx(section.rect.top - geometry.main.top, expected.top + cumulativeMeasuredDelta)

		const measuredDelta = section.rect.height - expected.height
		if (contentBoxIsNarrowed) {
			// The residual is the same quantity the exact branch compares, so it gets
			// the same per-width budget. Anything looser would quietly weaken parity
			// at the widths that do not rewrap.
			expectLineWrapGrowth(measuredDelta, section.lineHeights, {
				tolerance: roundingTolerance,
			})
		} else {
			expectPx(section.rect.height, expected.height, roundingTolerance)
		}
		cumulativeMeasuredDelta += measuredDelta
	}

	expectPx(geometry.main.height, target.mainHeight + cumulativeMeasuredDelta)
	if (viewportWidth === 768) expectPx(geometry.main.height, target.mainHeight, 3)
}

async function openHome(
	page: Page,
	locale: (typeof HOME_PARITY_LOCALES)[number],
	viewport: { height: number; width: number },
) {
	await page.setViewportSize(viewport)
	await prepareHomeRender(page, 'light')
	const response = await page.goto(locale.path)
	expect(response?.status()).toBe(200)
	await expect(page.locator('html')).toHaveAttribute('lang', locale.lang)
	await waitForHomeRender(page, 'light')
}

function expectContained(rect: HomeGeometryRect, container: HomeGeometryRect) {
	expect(rect.left).toBeGreaterThanOrEqual(container.left - 0.5)
	expect(rect.right).toBeLessThanOrEqual(container.right + 0.5)
	expect(rect.top).toBeGreaterThanOrEqual(container.top - 0.5)
	expect(rect.bottom).toBeLessThanOrEqual(container.bottom + 0.5)
}

function expectNoDocumentOverflow(geometry: HomeGeometry) {
	expect(geometry.document.scrollWidth).toBeLessThanOrEqual(geometry.document.clientWidth)
	expect(geometry.document.bodyScrollWidth).toBeLessThanOrEqual(geometry.document.bodyClientWidth)
}

function expectRectInvariant(before: HomeGeometryRect, after: HomeGeometryRect) {
	for (const key of ['bottom', 'height', 'left', 'right', 'top', 'width', 'x', 'y'] as const) {
		expectPx(after[key], before[key])
	}
}

test('records immutable browser evidence revision with explicit fallback precedence', () => {
	expect(resolveEvidenceRevision({ APP_REVISION: 'app-revision', GITHUB_SHA: 'github-sha' })).toBe(
		'app-revision',
	)
	expect(resolveEvidenceRevision({ GITHUB_SHA: 'github-sha' })).toBe('github-sha')
	expect(resolveEvidenceRevision({ APP_REVISION: '', GITHUB_SHA: 'github-sha' })).toBe('github-sha')
	expect(resolveEvidenceRevision({})).toBe(LOCAL_WORKING_TREE_REVISION)

	test.info().annotations.push({
		type: 'app-revision',
		description: resolveEvidenceRevision(),
	})
})

for (const locale of HOME_PARITY_LOCALES) {
	for (const viewport of matrixViewports) {
		test(`keeps integrated Home geometry at ${viewport.width}px for ${locale.id}`, async ({
			page,
		}) => {
			annotateEvidence(viewport)
			await openHome(page, locale, viewport)
			const main = page.locator('main')
			await expect(main).toHaveCount(1)

			const geometry = await main.evaluate(readHomeGeometry)
			annotateBrowserTopology(geometry, viewport.width)
			expect(geometry.children).toHaveLength(HOME_ORDERED_SECTION_CONTRACTS.length)
			expect(geometry.children.map((section) => section.tagName)).toEqual(
				HOME_ORDERED_SECTION_CONTRACTS.map(() => 'SECTION'),
			)
			expect(geometry.children.map((section) => section.id)).toEqual(
				HOME_ORDERED_SECTION_CONTRACTS.map((section) => section.id),
			)
			expect(geometry.children.map((section) => section.ariaLabelledBy)).toEqual(
				HOME_ORDERED_SECTION_CONTRACTS.map((section) => section.labelledBy),
			)

			for (const [index, contract] of HOME_ORDERED_SECTION_CONTRACTS.entries()) {
				const section = geometry.children[index]
				expect(section.labelResolvesInside).toBe(true)
				const shouldBeVisible = contract.visibility === 'always' || viewport.width >= 1024
				expect(section.visible).toBe(shouldBeVisible)
				if (section.visible) expectContained(section.rect, geometry.main)
			}

			const visibleSections = geometry.children.filter((section) => section.visible)
			expect(visibleSections).toHaveLength(viewport.width >= 1024 ? 6 : 5)
			for (let index = 1; index < visibleSections.length; index += 1) {
				expectPx(visibleSections[index].rect.top, visibleSections[index - 1].rect.bottom)
			}
			expectPx(visibleSections[0].rect.top, geometry.main.top)
			expectPx(visibleSections.at(-1)?.rect.bottom ?? Number.NaN, geometry.main.bottom)

			expectNoDocumentOverflow(geometry)
			expect(await findVisibleDescendantOverflow(page)).toEqual([])
			if (locale.id === 'en') expectEnglishFigmaGeometry(geometry, viewport.width)
		})
	}
}

for (const locale of HOME_PARITY_LOCALES) {
	for (const viewport of [HOME_PARITY_VIEWPORTS.desktop, HOME_PARITY_VIEWPORTS.mobile] as const) {
		test(`preserves ${viewport.width}px ${locale.id} geometry through the real theme toggle`, async ({
			page,
		}) => {
			annotateEvidence(viewport)
			await openHome(page, locale, viewport)
			const main = page.locator('main')
			const lightGeometry = await main.evaluate(readHomeGeometry)
			annotateBrowserTopology(lightGeometry, viewport.width)
			expectNoDocumentOverflow(lightGeometry)
			expect(await findVisibleDescendantOverflow(page)).toEqual([])

			if (viewport.width < 1024) {
				await page.getByRole('button', { exact: true, name: locale.openMenuName }).click()
			}
			const toggle = page.getByRole('button', { exact: true, name: locale.themeToggleName })
			await expect(toggle).toBeVisible()
			await toggle.click()
			if (viewport.width < 1024) {
				await page.getByRole('button', { exact: true, name: locale.closeMenuName }).click()
			}
			await waitForHomeRender(page, 'dark')

			const darkGeometry = await main.evaluate(readHomeGeometry)
			expectNoDocumentOverflow(darkGeometry)
			expect(await findVisibleDescendantOverflow(page)).toEqual([])
			expectRectInvariant(lightGeometry.main, darkGeometry.main)

			const lightVisible = lightGeometry.children.filter((section) => section.visible)
			const darkVisible = darkGeometry.children.filter((section) => section.visible)
			expect(darkVisible.map((section) => section.ariaLabelledBy)).toEqual(
				lightVisible.map((section) => section.ariaLabelledBy),
			)
			for (const [index, section] of darkVisible.entries()) {
				expectRectInvariant(lightVisible[index].rect, section.rect)
			}
		})
	}
}

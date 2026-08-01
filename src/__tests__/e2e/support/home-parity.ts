import { expect, type Page } from '@playwright/test'

export const FIGMA_HOME_NODES = {
	darkDesktop: '8:246',
	darkMobile: '8:325',
	desktop: '6:2',
	mobile: '8:87',
	responsive320: '8:140',
	responsive430: '8:193',
	tablet: '7:377',
} as const

/**
 * Browser viewport contracts paired with the approved full-page Figma frames.
 * The viewport heights keep browser runs practical; Figma frame heights describe
 * the complete page and must not become fixed application heights.
 */
export const HOME_PARITY_VIEWPORTS = {
	desktop: {
		figmaNode: FIGMA_HOME_NODES.desktop,
		darkFigmaNode: FIGMA_HOME_NODES.darkDesktop,
		height: 900,
		width: 1440,
	},
	tablet: {
		figmaNode: FIGMA_HOME_NODES.tablet,
		height: 1024,
		width: 768,
	},
	responsive430: {
		figmaNode: FIGMA_HOME_NODES.responsive430,
		height: 932,
		width: 430,
	},
	mobile: {
		figmaNode: FIGMA_HOME_NODES.mobile,
		darkFigmaNode: FIGMA_HOME_NODES.darkMobile,
		height: 844,
		width: 390,
	},
	responsive320: {
		figmaNode: FIGMA_HOME_NODES.responsive320,
		height: 900,
		width: 320,
	},
} as const

export const HOME_PARITY_LOCALES = [
	{
		closeMenuName: 'Close menu',
		id: 'en',
		lang: 'en',
		openMenuName: 'Open menu',
		path: '/',
		themeToggleName: 'Toggle color theme',
	},
	{
		closeMenuName: 'Zavřít nabídku',
		id: 'cs',
		lang: 'cs',
		openMenuName: 'Otevřít nabídku',
		path: '/cs',
		themeToggleName: 'Přepnout barevný motiv',
	},
] as const

export const HOME_ORDERED_SECTION_CONTRACTS = [
	{ id: null, key: 'hero', labelledBy: 'hero-heading', visibility: 'always' },
	{
		id: 'flagship-case',
		key: 'flagship',
		labelledBy: 'flagship-case-heading',
		visibility: 'always',
	},
	{
		id: 'selected-work',
		key: 'selectedWork',
		labelledBy: 'selected-work-heading',
		visibility: 'always',
	},
	{
		id: 'principles',
		key: 'principles',
		labelledBy: 'principles-heading',
		visibility: 'always',
	},
	{
		id: 'experience-snapshot',
		key: 'experience',
		labelledBy: 'experience-snapshot-heading',
		visibility: 'desktop',
	},
	{
		id: 'contact-cta',
		key: 'finalCta',
		labelledBy: 'final-cta-heading',
		visibility: 'always',
	},
] as const

export interface HomeGeometryRect {
	bottom: number
	height: number
	left: number
	right: number
	top: number
	width: number
	x: number
	y: number
}

export interface HomeDirectChildGeometry {
	ariaLabelledBy: string | null
	id: string | null
	labelResolvesInside: boolean
	/** Distinct computed line heights of the text this section actually renders. */
	lineHeights: number[]
	rect: HomeGeometryRect
	tagName: string
	visible: boolean
}

export interface HomeGeometry {
	document: {
		bodyClientWidth: number
		bodyScrollWidth: number
		clientWidth: number
		scrollWidth: number
	}
	children: HomeDirectChildGeometry[]
	main: HomeGeometryRect
}

/** Pure DOM reader: it reports Home topology and geometry without knowing copy or CSS selectors. */
export function readHomeGeometry(main: HTMLElement): HomeGeometry {
	const readRect = (element: Element): HomeGeometryRect => {
		const rect = element.getBoundingClientRect()
		return {
			bottom: rect.bottom,
			height: rect.height,
			left: rect.left,
			right: rect.right,
			top: rect.top,
			width: rect.width,
			x: rect.x,
			y: rect.y,
		}
	}

	// Every line box a section can add when its copy wraps. Collected from the
	// elements that actually own text, so a growth allowance can be expressed as
	// "N more line boxes of type that this section renders" instead of a pixel
	// amount measured once on one machine.
	const readLineHeights = (element: Element): number[] => {
		const values = new Set<number>()
		const visit = (node: Element) => {
			const ownsText = Array.from(node.childNodes).some(
				(child) => child.nodeType === Node.TEXT_NODE && (child.textContent ?? '').trim() !== '',
			)
			if (ownsText) {
				const lineHeight = Number.parseFloat(getComputedStyle(node).lineHeight)
				if (Number.isFinite(lineHeight) && lineHeight > 0) {
					values.add(Math.round(lineHeight * 1000) / 1000)
				}
			}
			for (const child of Array.from(node.children)) visit(child)
		}
		visit(element)
		return Array.from(values).sort((first, second) => first - second)
	}

	const children = Array.from(main.children).map((element) => {
		const rect = readRect(element)
		const styles = getComputedStyle(element)
		const ariaLabelledBy = element.getAttribute('aria-labelledby')
		const label = ariaLabelledBy ? document.getElementById(ariaLabelledBy) : null
		return {
			ariaLabelledBy,
			id: element.id || null,
			labelResolvesInside: label !== null && element.contains(label),
			lineHeights: readLineHeights(element),
			rect,
			tagName: element.tagName,
			visible:
				styles.display !== 'none' &&
				styles.visibility !== 'hidden' &&
				Number.parseFloat(styles.opacity) !== 0 &&
				rect.width > 0 &&
				rect.height > 0,
		}
	})

	return {
		children,
		document: {
			bodyClientWidth: document.body.clientWidth,
			bodyScrollWidth: document.body.scrollWidth,
			clientWidth: document.documentElement.clientWidth,
			scrollWidth: document.documentElement.scrollWidth,
		},
		main: readRect(main),
	}
}

export const HOME_SELECTORS = {
	experience: '#experience-snapshot',
	experienceHeading: '#experience-snapshot-heading',
	finalCta: '#contact-cta',
	finalCtaHeading: '#final-cta-heading',
	flagship: '#flagship-case',
	flagshipContent: '#flagship-case-content',
	flagshipHeading: '#flagship-case-heading',
	flagshipMap: '#flagship-system-map',
	flagshipRow: '#flagship-case-summary-row',
	flagshipStack: '#flagship-case-stack',
	flagshipSummary: '#flagship-case-summary',
	flagshipSummaryCompact: '#flagship-summary-compact',
	flagshipSummaryDesktop: '#flagship-summary-desktop',
	flagshipTitleCompact: '#flagship-title-compact',
	flagshipTitleDesktop: '#flagship-title-desktop',
	hero: 'section[aria-labelledby="hero-heading"]',
	heroHeading: '#hero-heading',
	principles: '#principles',
	principlesHeading: '#principles-heading',
	selectedWork: '#selected-work',
	selectedWorkHeading: '#selected-work-heading',
} as const

export type HomeTheme = 'dark' | 'light'

/** Assert an absolute CSS-pixel tolerance (unlike toBeCloseTo's precision argument). */
export function expectPx(actual: number, expected: number, tolerance = 0.5): void {
	const difference = Math.abs(actual - expected)
	expect(
		difference,
		`Expected ${actual}px to be within ±${tolerance}px of ${expected}px (difference: ${difference}px)`,
	).toBeLessThanOrEqual(tolerance)
}

/**
 * Assert that a section is taller than its approved Figma frame by a whole number
 * of line boxes and by nothing else.
 *
 * When Chromium reserves a vertical-scrollbar gutter the content box narrows, so
 * copy can wrap onto further lines and the section grows. How many lines it gains
 * depends on font metrics, which differ between the CI Linux image and a developer
 * machine: at 390px the Home Hero gains exactly one 24.65625px body line on Linux
 * and none on Windows. Both are correct renders of the same layout.
 *
 * Pinning the growth to an amount measured once on one machine therefore encodes
 * that machine into the contract. Requiring a whole multiple of a line height the
 * section really renders keeps the contract environment-independent while still
 * rejecting growth that no line wrap explains -- a stray margin or padding
 * regression is not a multiple of any line box.
 *
 * `tolerance` must stay the same rounding budget the no-gutter comparison uses
 * for that viewport. Every viewport reserves a gutter on some platforms --
 * Windows reserves one even at 1440px -- so a looser default here would weaken
 * the exact contract at the widths that never rewrap.
 */
export function expectLineWrapGrowth(
	growth: number,
	lineHeights: readonly number[],
	{ maxLines = 3, tolerance = 3 }: { maxLines?: number; tolerance?: number } = {},
): void {
	expect(lineHeights.length, 'no text line heights were measured for this section').toBeGreaterThan(
		0,
	)

	const candidates = lineHeights.flatMap((lineHeight) =>
		Array.from({ length: maxLines + 1 }, (_unused, lines) => ({
			lineHeight,
			lines,
			residual: growth - lines * lineHeight,
		})),
	)
	const best = candidates.reduce((closest, candidate) =>
		Math.abs(candidate.residual) < Math.abs(closest.residual) ? candidate : closest,
	)

	expect(
		Math.abs(best.residual),
		`Expected ${growth}px of growth to be a whole number of wrapped line boxes ` +
			`(line heights present: ${lineHeights.join(', ')}px; closest fit: ${best.lines} x ` +
			`${best.lineHeight}px leaving ${best.residual}px unexplained)`,
	).toBeLessThanOrEqual(tolerance)
}

/** Call before navigation so the first rendered frame has deterministic theme/media state. */
export async function prepareHomeRender(page: Page, theme: HomeTheme = 'light'): Promise<void> {
	await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
	await page.addInitScript((selectedTheme) => {
		localStorage.setItem('codeguy-theme', selectedTheme)
	}, theme)
}

/** Call after navigation before geometry or visual assertions. */
export async function waitForHomeRender(page: Page, theme: HomeTheme = 'light'): Promise<void> {
	await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
	await page.evaluate(async () => {
		await document.fonts.ready
		await new Promise<void>((resolve) => {
			requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
		})
	})
}

export interface VisibleDescendantOverflow {
	ariaLabel: string | null
	id: string | null
	left: number
	right: number
	tagName: string
	testId: string | null
	visibleLeft: number
	visibleRight: number
	width: number
}

export interface VisibleDescendantOverflowOptions {
	allowlist?: readonly string[]
	root?: string
	tolerance?: number
}

/**
 * Intentionally empty: add only a selector for a measured, design-backed exception
 * and document its Figma node in the calling test. Broad layout selectors are not
 * acceptable because they would hide regressions.
 */
export const HOME_VISIBLE_OVERFLOW_ALLOWLIST: readonly string[] = []

/**
 * Finds horizontally leaking visible descendants. Local clipping containers are
 * respected, but html/body clipping is deliberately ignored: global overflow-x
 * suppression is not evidence that Home content fits the viewport.
 */
export async function findVisibleDescendantOverflow(
	page: Page,
	options: VisibleDescendantOverflowOptions = {},
): Promise<VisibleDescendantOverflow[]> {
	const { allowlist = HOME_VISIBLE_OVERFLOW_ALLOWLIST, root = 'main', tolerance = 0.5 } = options
	const rootLocator = page.locator(root)
	await expect(rootLocator).toBeAttached()

	return rootLocator.evaluate(
		(rootElement, settings) => {
			const viewportWidth = document.documentElement.clientWidth

			return Array.from(rootElement.querySelectorAll<HTMLElement>('*')).flatMap((element) => {
				if (settings.allowlist.some((selector) => element.closest(selector))) return []

				const styles = getComputedStyle(element)
				const rect = element.getBoundingClientRect()
				if (
					styles.display === 'none' ||
					styles.visibility === 'hidden' ||
					Number.parseFloat(styles.opacity) === 0 ||
					rect.width === 0 ||
					rect.height === 0
				) {
					return []
				}

				let visibleLeft = rect.left
				let visibleRight = rect.right
				for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
					if (ancestor === document.body || ancestor === document.documentElement) continue
					const overflowX = getComputedStyle(ancestor).overflowX
					if (['auto', 'clip', 'hidden', 'scroll'].includes(overflowX)) {
						const ancestorRect = ancestor.getBoundingClientRect()
						visibleLeft = Math.max(visibleLeft, ancestorRect.left)
						visibleRight = Math.min(visibleRight, ancestorRect.right)
					}
				}

				if (
					visibleRight <= visibleLeft ||
					(visibleLeft >= -settings.tolerance && visibleRight <= viewportWidth + settings.tolerance)
				) {
					return []
				}

				return [
					{
						ariaLabel: element.getAttribute('aria-label'),
						id: element.id || null,
						left: rect.left,
						right: rect.right,
						tagName: element.tagName.toLowerCase(),
						testId: element.getAttribute('data-testid'),
						visibleLeft,
						visibleRight,
						width: rect.width,
					},
				]
			})
		},
		{ allowlist: [...allowlist], tolerance },
	)
}

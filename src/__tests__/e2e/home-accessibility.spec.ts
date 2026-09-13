import { expect, type Page, test } from '@playwright/test'

import {
	HOME_PARITY_VIEWPORTS,
	type HomeTheme,
	prepareHomeRender,
	waitForHomeRender,
} from './support/home-parity'

import { APPROVED_HOME_HERO } from './support/approved-copy'

interface ExpectedHeading {
	level: 1 | 2 | 3
	name: string
}

interface ExpectedLink {
	href: string
	name: string
}

interface HomeAccessibilityContract {
	id: 'cs' | 'en'
	lang: 'cs' | 'en'
	path: '/cs' | '/'
	/** Locale-neutral: a personal name is not translated (BL-003). */
	heroName: 'Karel Kutchan'
	skipLink: string
	pending: string
	desktop: {
		headings: ExpectedHeading[]
		links: ExpectedLink[]
		sectionNames: string[]
	}
	compact: {
		headings: ExpectedHeading[]
		links: ExpectedLink[]
		sectionNames: string[]
	}
}

const englishSharedHeadings: ExpectedHeading[] = [
	{ level: 1, name: APPROVED_HOME_HERO.en.headline },
	// HP-04: the eyebrow-styled section heading of the Worked-with row.
	{ level: 2, name: 'WORKED WITH' },
	{ level: 2, name: 'A customer portal built as a system, not a collection of screens.' },
	{ level: 2, name: 'Complex products. Clear frontend decisions.' },
	{ level: 3, name: 'Maintenance applications' },
	{ level: 3, name: 'Distributed energy platform' },
	{ level: 3, name: 'Accessibility refactoring' },
	{
		level: 2,
		name: 'Senior engineering is mostly about making good decisions repeatable.',
	},
	{ level: 3, name: 'Architecture with a reason' },
	{ level: 3, name: 'Accessibility by default' },
	{ level: 3, name: 'Quality that supports delivery' },
	{ level: 3, name: 'Leadership through clarity' },
]

/** Compact widths swap two headings for their shorter catalog variants; match them by name. */
function withCompactHeadings(
	headings: ExpectedHeading[],
	replacements: Record<string, string>,
): ExpectedHeading[] {
	const seen = new Set<string>()
	const compact = headings.map((heading) => {
		const replacement = replacements[heading.name]
		if (replacement === undefined) return heading
		seen.add(heading.name)
		return { level: heading.level, name: replacement }
	})
	for (const name of Object.keys(replacements)) {
		if (!seen.has(name)) throw new Error(`Compact replacement target not found: ${name}`)
	}
	return compact
}

const czechSharedHeadings: ExpectedHeading[] = [
	{ level: 1, name: APPROVED_HOME_HERO.cs.headline },
	{ level: 2, name: 'SPOLUPRACOVAL JSEM S' },
	{
		level: 2,
		name: 'Zákaznický portál postavený jako systém, ne jako sbírka obrazovek.',
	},
	{ level: 2, name: 'Komplexní produkty. Jasná frontendová rozhodnutí.' },
	{ level: 3, name: 'Aplikace pro údržbu' },
	{ level: 3, name: 'Platforma pro distribuovanou energetiku' },
	{ level: 3, name: 'Refaktoring přístupnosti' },
	{
		level: 2,
		name: 'Seniorní práce je hlavně o tom, aby se dobrá rozhodnutí dala opakovat.',
	},
	{ level: 3, name: 'Architektura s důvodem' },
	{ level: 3, name: 'Přístupnost od začátku' },
	{ level: 3, name: 'Kvalita podporující dodávku' },
	{ level: 3, name: 'Vedení skrze srozumitelnost' },
]

const contracts: HomeAccessibilityContract[] = [
	{
		id: 'en',
		lang: 'en',
		path: '/',
		heroName: 'Karel Kutchan',
		skipLink: 'Skip to main content',
		pending: 'Case study coming soon',
		desktop: {
			headings: [
				...englishSharedHeadings,
				{ level: 2, name: 'From implementation to frontend leadership.' },
				{
					level: 2,
					name: 'Looking for a senior frontend engineer who can own the system behind the interface?',
				},
			],
			links: [
				{ href: '/work/energy-customer-portal', name: APPROVED_HOME_HERO.en.primaryCta },
				{ href: '/contact/book', name: APPROVED_HOME_HERO.en.secondaryCta },
				{ href: '/work/energy-customer-portal', name: 'Read the case' },
				{ href: '/work/maintenance-applications', name: 'Read case' },
				{ href: '/work/distributed-energy-platform', name: 'Read case' },
				{ href: '/experience', name: 'View full experience' },
				{ href: '/contact', name: 'Start a conversation' },
			],
			sectionNames: [
				APPROVED_HOME_HERO.en.headline,
				'WORKED WITH',
				'A customer portal built as a system, not a collection of screens.',
				'Complex products. Clear frontend decisions.',
				'Senior engineering is mostly about making good decisions repeatable.',
				'From implementation to frontend leadership.',
				'Looking for a senior frontend engineer who can own the system behind the interface?',
			],
		},
		compact: {
			headings: [
				...withCompactHeadings(englishSharedHeadings, {
					'A customer portal built as a system, not a collection of screens.':
						'A customer portal built as a system.',
					'Senior engineering is mostly about making good decisions repeatable.':
						'Good decisions should be repeatable.',
				}),
				{
					level: 2,
					name: 'Looking for a senior frontend engineer who can own the system behind the interface?',
				},
			],
			links: [
				{ href: '/work/energy-customer-portal', name: APPROVED_HOME_HERO.en.primaryCta },
				{ href: '/contact/book', name: APPROVED_HOME_HERO.en.secondaryCta },
				{ href: '/work/energy-customer-portal', name: 'Read the case' },
				{ href: '/work/maintenance-applications', name: 'Read case' },
				{ href: '/work/distributed-energy-platform', name: 'Read case' },
				{ href: '/contact', name: 'Start a conversation' },
			],
			sectionNames: [
				APPROVED_HOME_HERO.en.headline,
				'WORKED WITH',
				'A customer portal built as a system.',
				'Complex products. Clear frontend decisions.',
				'Good decisions should be repeatable.',
				'Looking for a senior frontend engineer who can own the system behind the interface?',
			],
		},
	},
	{
		id: 'cs',
		lang: 'cs',
		path: '/cs',
		heroName: 'Karel Kutchan',
		skipLink: 'Přeskočit na hlavní obsah',
		pending: 'Případová studie se připravuje',
		desktop: {
			headings: [
				...czechSharedHeadings,
				{ level: 2, name: 'Od implementace k vedení frontend vývoje.' },
				{
					level: 2,
					name: 'Hledáte senior frontend vývojáře, který převezme odpovědnost za systém pod rozhraním?',
				},
			],
			links: [
				{
					href: '/cs/work/energy-customer-portal',
					name: APPROVED_HOME_HERO.cs.primaryCta,
				},
				{ href: '/cs/contact/book', name: APPROVED_HOME_HERO.cs.secondaryCta },
				{ href: '/cs/work/energy-customer-portal', name: 'Přečíst studii' },
				{ href: '/cs/work/maintenance-applications', name: 'Přečíst studii' },
				{ href: '/cs/work/distributed-energy-platform', name: 'Přečíst studii' },
				{ href: '/cs/experience', name: 'Zobrazit všechny zkušenosti' },
				{ href: '/cs/contact', name: 'Začít konverzaci' },
			],
			sectionNames: [
				APPROVED_HOME_HERO.cs.headline,
				'SPOLUPRACOVAL JSEM S',
				'Zákaznický portál postavený jako systém, ne jako sbírka obrazovek.',
				'Komplexní produkty. Jasná frontendová rozhodnutí.',
				'Seniorní práce je hlavně o tom, aby se dobrá rozhodnutí dala opakovat.',
				'Od implementace k vedení frontend vývoje.',
				'Hledáte senior frontend vývojáře, který převezme odpovědnost za systém pod rozhraním?',
			],
		},
		compact: {
			headings: [
				...withCompactHeadings(czechSharedHeadings, {
					'Zákaznický portál postavený jako systém, ne jako sbírka obrazovek.':
						'Zákaznický portál postavený jako systém.',
					'Seniorní práce je hlavně o tom, aby se dobrá rozhodnutí dala opakovat.':
						'Dobrá rozhodnutí se musí dát opakovat.',
				}),
				{
					level: 2,
					name: 'Hledáte senior frontend vývojáře, který převezme odpovědnost za systém pod rozhraním?',
				},
			],
			links: [
				{
					href: '/cs/work/energy-customer-portal',
					name: APPROVED_HOME_HERO.cs.primaryCta,
				},
				{ href: '/cs/contact/book', name: APPROVED_HOME_HERO.cs.secondaryCta },
				{ href: '/cs/work/energy-customer-portal', name: 'Přečíst studii' },
				{ href: '/cs/work/maintenance-applications', name: 'Přečíst studii' },
				{ href: '/cs/work/distributed-energy-platform', name: 'Přečíst studii' },
				{ href: '/cs/contact', name: 'Začít konverzaci' },
			],
			sectionNames: [
				APPROVED_HOME_HERO.cs.headline,
				'SPOLUPRACOVAL JSEM S',
				'Zákaznický portál postavený jako systém.',
				'Komplexní produkty. Jasná frontendová rozhodnutí.',
				'Dobrá rozhodnutí se musí dát opakovat.',
				'Hledáte senior frontend vývojáře, který převezme odpovědnost za systém pod rozhraním?',
			],
		},
	},
]

const matrix = [
	{ id: 'desktop', compact: false, viewport: HOME_PARITY_VIEWPORTS.desktop },
	{ id: 'mobile', compact: true, viewport: HOME_PARITY_VIEWPORTS.mobile },
] as const

const themes: HomeTheme[] = ['light', 'dark']

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
		const channels = parseRgb(color).map((value) => {
			const normalized = value / 255
			return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
		})
		return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
	}

	const foregroundLuminance = luminance(foreground)
	const backgroundLuminance = luminance(background)
	return (
		(Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
		(Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
	)
}

function getExpectedLink(page: Page, link: ExpectedLink) {
	return page
		.locator('main')
		.getByRole('link', { exact: true, name: link.name })
		.and(page.locator(`main a[href="${link.href}"]`))
}

async function expectHeadingOrder(page: Page, expected: ExpectedHeading[]) {
	const actual = await page.locator('main :is(h1, h2, h3):visible').evaluateAll((headings) =>
		headings.map((heading) => ({
			level: Number(heading.tagName.slice(1)),
			name: (heading as HTMLElement).innerText.replace(/\s+/g, ' ').trim(),
		})),
	)

	expect(actual).toEqual(expected)
}

/**
 * HP-01/HP-02 hero contract: the name sits in the eyebrow paragraph (not a heading), the
 * locked headline is the only heading in the hero, and the only focusable elements are the
 * flagship button followed by the intro-call button — so Tab order is primary, then
 * secondary. The availability line (HP-03) adds no focusable element.
 */
async function expectHeroIdentityContract(
	page: Page,
	{
		headline,
		name,
		primaryHref,
		secondaryHref,
	}: { headline: string; name: string; primaryHref: string; secondaryHref: string },
) {
	const hero = page.locator('section[aria-labelledby="hero-heading"]')
	await expect(hero.getByRole('heading')).toHaveCount(1)
	await expect(hero.getByRole('heading', { exact: true, level: 1, name: headline })).toBeVisible()

	const identity = hero.locator('span', { hasText: name })
	await expect(identity).toHaveCount(1)
	await expect(identity).toBeVisible()
	const placement = await identity.evaluate((element) => {
		const heading = document.getElementById('hero-heading')

		return {
			insideHeading: element.closest('h1, h2, h3, h4, h5, h6') !== null,
			parentTag: element.parentElement?.tagName ?? null,
			precedesHeadline:
				heading !== null &&
				Boolean(element.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING),
			text: element.textContent?.trim() ?? '',
		}
	})
	expect(placement).toEqual({
		insideHeading: false,
		parentTag: 'P',
		precedesHeadline: true,
		text: name,
	})

	const focusables = hero.locator('a[href], button, [tabindex]:not([tabindex="-1"])')
	await expect(focusables).toHaveCount(2)
	await expect(focusables.nth(0)).toHaveAttribute('href', primaryHref)
	await expect(focusables.nth(1)).toHaveAttribute('href', secondaryHref)
	await expect(focusables.nth(1)).not.toHaveAttribute('target')
	await expect(hero.locator('a[href^="mailto:"]')).toHaveCount(0)
}

/**
 * HP-04: the Worked-with row is a named region whose only heading is its eyebrow-styled
 * label; the marks expose the company names as images and nothing in the row is focusable.
 */
async function expectWorkedWithContract(page: Page, heading: string) {
	const section = page.locator('#worked-with')
	await expect(section).toBeVisible()
	await expect(section).toHaveAttribute('aria-labelledby', 'worked-with-heading')
	await expect(section.getByRole('heading')).toHaveCount(1)
	await expect(section.getByRole('heading', { exact: true, level: 2, name: heading })).toBeVisible()

	const marks = section.getByRole('img')
	await expect(marks).toHaveCount(7)
	await expect(marks).toHaveText(['', '', '', '', '', '', ''])
	for (const name of [
		'Národní knihovna ČR',
		'E.ON',
		'MND',
		'Kontent.ai',
		'Skype',
		'Jobs.cz',
		'eMan',
	]) {
		await expect(section.getByRole('img', { exact: true, name })).toBeVisible()
	}
	await expect(section.locator('a[href], button, [tabindex]:not([tabindex="-1"])')).toHaveCount(0)
}

async function expectLocalizedSections(page: Page, sectionNames: string[]) {
	for (const name of sectionNames) {
		await expect(page.getByRole('region', { exact: true, name })).toHaveCount(1)
	}
	await expect(page.getByRole('region')).toHaveCount(sectionNames.length)
}

async function expectPendingCardHasNoLink(page: Page, pendingName: string) {
	const card = page.locator('article[data-work-key="accessibilityRefactoring"]')
	await expect(card).toBeVisible()
	await expect(card.getByText(pendingName, { exact: true })).toBeVisible()
	await expect(card.getByRole('link')).toHaveCount(0)
	await expect(card.locator('[data-work-card-action]')).toHaveCount(0)
}

async function expectLocalizedLinks(page: Page, links: ExpectedLink[]) {
	const mainLinks = page.locator('main').getByRole('link')
	await expect(mainLinks).toHaveCount(links.length)

	for (const link of links) {
		const accessibleLink = getExpectedLink(page, link)
		await expect(accessibleLink).toHaveCount(1)
		await expect(accessibleLink).toHaveAttribute('href', link.href)
	}
}

async function expectSkipLinkWorks(page: Page, name: string): Promise<void> {
	const skipLink = page.getByRole('link', { exact: true, name })
	await expect(skipLink).toHaveAttribute('href', '#main-content')
	await page.keyboard.press('Tab')
	await expect(skipLink).toBeFocused()
	await expect(skipLink).toBeVisible()
	await page.keyboard.press('Enter')
	await expect(page.locator('main#main-content')).toBeFocused()
}

async function expectLinksReachableWithVisibleFocus(page: Page, links: ExpectedLink[]) {
	for (const expectedLink of links) {
		await page.keyboard.press('Tab')
		const target = getExpectedLink(page, expectedLink)
		await expect(target).toBeFocused()
		const focused = await target.evaluate((element) => {
			const styles = getComputedStyle(element)
			let paintedBackground: string | null = null
			for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
				const background = getComputedStyle(ancestor).backgroundColor
				const channels = background.match(/[\d.]+/g)?.map(Number) ?? []
				const alpha = channels.length >= 4 ? channels[3] : 1
				if (background !== 'transparent' && alpha > 0) {
					paintedBackground = background
					break
				}
			}
			if (!paintedBackground) throw new Error('Expected a painted ancestor behind the focus ring')

			return {
				focusVisible: element.matches(':focus-visible'),
				outlineColor: styles.outlineColor,
				outlineStyle: styles.outlineStyle,
				outlineWidth: Number.parseFloat(styles.outlineWidth),
				paintedBackground,
			}
		})

		expect(focused).toMatchObject({
			focusVisible: true,
			outlineStyle: 'solid',
			outlineWidth: 2,
		})
		expect(focused.outlineColor).not.toBe('rgba(0, 0, 0, 0)')
		expect(contrastRatio(focused.outlineColor, focused.paintedBackground)).toBeGreaterThanOrEqual(3)
	}
}

async function expectReducedMotionContract(page: Page) {
	const contract = await page.evaluate(() => {
		const parseTime = (value: string) => {
			const trimmed = value.trim()
			return trimmed.endsWith('ms') ? Number.parseFloat(trimmed) : Number.parseFloat(trimmed) * 1000
		}
		const maxTime = (value: string) => Math.max(...value.split(',').map(parseTime))
		const roots = [
			document.documentElement,
			document.body,
			document.querySelector('a[href="#main-content"]'),
			document.querySelector('main'),
		].filter((element): element is Element => element !== null)
		const elements = Array.from(
			new Set(roots.flatMap((root) => [root, ...root.querySelectorAll('*')])),
		)
		const offenders: Array<{
			animationDurationMs: number
			description: string
			pseudo: string
			transitionDurationMs: number
		}> = []

		for (const element of elements) {
			for (const pseudo of ['', '::before', '::after']) {
				const styles = getComputedStyle(element, pseudo || null)
				const animationDurationMs = maxTime(styles.animationDuration)
				const transitionDurationMs = maxTime(styles.transitionDuration)
				if (animationDurationMs > 0.0011 || transitionDurationMs > 0.0011) {
					offenders.push({
						animationDurationMs,
						description: `${element.tagName.toLowerCase()}#${element.id}.${element.className}`,
						pseudo,
						transitionDurationMs,
					})
				}
			}
		}

		return {
			offenders,
			reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
			scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
		}
	})

	expect(contract.reducedMotion).toBe(true)
	expect(contract.scrollBehavior).toBe('auto')
	expect(contract.offenders).toEqual([])
}

for (const locale of contracts) {
	for (const target of matrix) {
		for (const theme of themes) {
			test(`${locale.id} Home exposes its ${target.id} ${theme} accessibility contract`, async ({
				page,
			}) => {
				await page.setViewportSize(target.viewport)
				await prepareHomeRender(page, theme)
				const response = await page.goto(locale.path)
				expect(response?.status()).toBe(200)
				await waitForHomeRender(page, theme)

				const expected = target.compact ? locale.compact : locale.desktop
				await expect(page.locator('html')).toHaveAttribute('lang', locale.lang)
				await expect(page.locator('main')).toHaveCount(1)
				await expect(page.locator('main')).toBeVisible()
				await expect(page.locator('h1:visible')).toHaveCount(1)
				await expectHeadingOrder(page, expected.headings)
				await expectHeroIdentityContract(page, {
					headline: expected.headings[0].name,
					name: locale.heroName,
					primaryHref: expected.links[0].href,
					secondaryHref: expected.links[1].href,
				})
				await expectWorkedWithContract(page, expected.headings[1].name)
				await expectLocalizedSections(page, expected.sectionNames)
				await expectLocalizedLinks(page, expected.links)
				await expectPendingCardHasNoLink(page, locale.pending)

				const experience = page.locator('#experience-snapshot')
				if (target.compact) {
					await expect(experience).toBeHidden()
					await expect(experience.getByRole('heading')).toHaveCount(0)
					await expect(experience.getByRole('link')).toHaveCount(0)
				} else {
					await expect(experience).toBeVisible()
					await expect(experience.getByRole('heading', { level: 2 })).toHaveCount(1)
					await expect(experience.getByRole('link')).toHaveCount(1)
				}

				await expectSkipLinkWorks(page, locale.skipLink)
				await expectLinksReachableWithVisibleFocus(page, expected.links)
				await expectReducedMotionContract(page)
			})
		}
	}
}

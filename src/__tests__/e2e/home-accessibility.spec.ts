import { expect, type Page, test } from '@playwright/test'

import {
	HOME_PARITY_VIEWPORTS,
	type HomeTheme,
	prepareHomeRender,
	waitForHomeRender,
} from './support/home-parity'

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
	{ level: 1, name: 'I build frontend systems for products that have to last.' },
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

const czechSharedHeadings: ExpectedHeading[] = [
	{ level: 1, name: 'Stavím frontendové systémy pro produkty, které musí vydržet.' },
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
				{ href: '/work/energy-customer-portal', name: 'Read flagship case' },
				{ href: '/experience', name: 'View experience' },
				{ href: '/work/energy-customer-portal', name: 'Read the case' },
				{ href: '/work/maintenance-applications', name: 'Read case' },
				{ href: '/work/distributed-energy-platform', name: 'Read case' },
				{ href: '/experience', name: 'View full experience' },
				{ href: '/contact', name: 'Start a conversation' },
			],
			sectionNames: [
				'I build frontend systems for products that have to last.',
				'A customer portal built as a system, not a collection of screens.',
				'Complex products. Clear frontend decisions.',
				'Senior engineering is mostly about making good decisions repeatable.',
				'From implementation to frontend leadership.',
				'Looking for a senior frontend engineer who can own the system behind the interface?',
			],
		},
		compact: {
			headings: [
				...englishSharedHeadings.map((heading, index) => {
					if (index === 1) {
						return { level: 2, name: 'A customer portal built as a system.' } as const
					}
					if (index === 6) {
						return { level: 2, name: 'Good decisions should be repeatable.' } as const
					}
					return heading
				}),
				{
					level: 2,
					name: 'Looking for a senior frontend engineer who can own the system behind the interface?',
				},
			],
			links: [
				{ href: '/work/energy-customer-portal', name: 'Read flagship case' },
				{ href: '/experience', name: 'View experience' },
				{ href: '/work/energy-customer-portal', name: 'Read the case' },
				{ href: '/work/maintenance-applications', name: 'Read case' },
				{ href: '/work/distributed-energy-platform', name: 'Read case' },
				{ href: '/contact', name: 'Start a conversation' },
			],
			sectionNames: [
				'I build frontend systems for products that have to last.',
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
					name: 'Přečíst hlavní případovou studii',
				},
				{ href: '/cs/experience', name: 'Zobrazit zkušenosti' },
				{ href: '/cs/work/energy-customer-portal', name: 'Přečíst studii' },
				{ href: '/cs/work/maintenance-applications', name: 'Přečíst studii' },
				{ href: '/cs/work/distributed-energy-platform', name: 'Přečíst studii' },
				{ href: '/cs/experience', name: 'Zobrazit všechny zkušenosti' },
				{ href: '/cs/contact', name: 'Začít konverzaci' },
			],
			sectionNames: [
				'Stavím frontendové systémy pro produkty, které musí vydržet.',
				'Zákaznický portál postavený jako systém, ne jako sbírka obrazovek.',
				'Komplexní produkty. Jasná frontendová rozhodnutí.',
				'Seniorní práce je hlavně o tom, aby se dobrá rozhodnutí dala opakovat.',
				'Od implementace k vedení frontend vývoje.',
				'Hledáte senior frontend vývojáře, který převezme odpovědnost za systém pod rozhraním?',
			],
		},
		compact: {
			headings: [
				...czechSharedHeadings.map((heading, index) => {
					if (index === 1) {
						return { level: 2, name: 'Zákaznický portál postavený jako systém.' } as const
					}
					if (index === 6) {
						return { level: 2, name: 'Dobrá rozhodnutí se musí dát opakovat.' } as const
					}
					return heading
				}),
				{
					level: 2,
					name: 'Hledáte senior frontend vývojáře, který převezme odpovědnost za systém pod rozhraním?',
				},
			],
			links: [
				{
					href: '/cs/work/energy-customer-portal',
					name: 'Přečíst hlavní případovou studii',
				},
				{ href: '/cs/experience', name: 'Zobrazit zkušenosti' },
				{ href: '/cs/work/energy-customer-portal', name: 'Přečíst studii' },
				{ href: '/cs/work/maintenance-applications', name: 'Přečíst studii' },
				{ href: '/cs/work/distributed-energy-platform', name: 'Přečíst studii' },
				{ href: '/cs/contact', name: 'Začít konverzaci' },
			],
			sectionNames: [
				'Stavím frontendové systémy pro produkty, které musí vydržet.',
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

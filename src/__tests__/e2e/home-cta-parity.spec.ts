import { expect, type Locator, type Page, test } from '@playwright/test'

interface LocaleExpectation {
	path: '/' | '/cs'
	labels: {
		heroPrimary: string
		heroSecondary: string
		flagship: string
		experience: string
		final: string
	}
	hrefs: {
		flagship: string
		experience: string
		contact: string
	}
}

const localeExpectations: LocaleExpectation[] = [
	{
		path: '/',
		labels: {
			heroPrimary: 'Read flagship case',
			heroSecondary: 'View experience',
			flagship: 'Read the case',
			experience: 'View full experience',
			final: 'Start a conversation',
		},
		hrefs: {
			flagship: '/work/energy-customer-portal',
			experience: '/experience',
			contact: '/contact',
		},
	},
	{
		path: '/cs',
		labels: {
			heroPrimary: 'Přečíst hlavní případovou studii',
			heroSecondary: 'Zobrazit zkušenosti',
			flagship: 'Přečíst studii',
			experience: 'Zobrazit všechny zkušenosti',
			final: 'Začít konverzaci',
		},
		hrefs: {
			flagship: '/cs/work/energy-customer-portal',
			experience: '/cs/experience',
			contact: '/cs/contact',
		},
	},
]

function getHomeCtas(page: Page, expectation: LocaleExpectation) {
	const hero = page.locator('section[aria-labelledby="hero-heading"]')
	const flagship = page.locator('#flagship-case')
	const experience = page.locator('#experience-snapshot')
	const final = page.locator('#contact-cta')

	return {
		heroPrimary: hero.getByRole('link', {
			exact: true,
			name: expectation.labels.heroPrimary,
		}),
		heroSecondary: hero.getByRole('link', {
			exact: true,
			name: expectation.labels.heroSecondary,
		}),
		flagship: flagship.getByRole('link', {
			exact: true,
			name: expectation.labels.flagship,
		}),
		experience: experience.getByRole('link', {
			exact: true,
			name: expectation.labels.experience,
		}),
		final: final.getByRole('link', {
			exact: true,
			name: expectation.labels.final,
		}),
	}
}

async function expectLargeButtonContract(link: Locator) {
	await expect(link).toBeVisible()

	const contract = await link.evaluate((element) => {
		const styles = getComputedStyle(element)
		const content = element.firstElementChild

		if (!(content instanceof HTMLElement)) {
			throw new Error('Expected the canonical button-content wrapper')
		}

		const textLineTops = Array.from(content.childNodes)
			.filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
			.flatMap((node) => {
				const range = document.createRange()
				range.selectNodeContents(node)

				return Array.from(range.getClientRects(), (rect) => Math.round(rect.top * 100) / 100)
			})

		return {
			height: element.getBoundingClientRect().height,
			paddingInlineEnd: Number.parseFloat(styles.paddingInlineEnd),
			paddingInlineStart: Number.parseFloat(styles.paddingInlineStart),
			radius: Number.parseFloat(styles.borderStartStartRadius),
			textLineCount: new Set(textLineTops).size,
		}
	})

	expect(contract).toEqual({
		height: 52,
		paddingInlineEnd: 20,
		paddingInlineStart: 20,
		radius: 4,
		textLineCount: 1,
	})
}

interface HeroActionLayoutExpectation {
	direction: 'column' | 'row'
	gap: number
	paragraphGap: number
}

async function expectHeroActionLayout(
	primary: Locator,
	secondary: Locator,
	expectation: HeroActionLayoutExpectation,
) {
	const actions = primary.locator('..')

	const layout = await actions.evaluate((element) => {
		const links = Array.from(element.children).filter(
			(child): child is HTMLAnchorElement => child instanceof HTMLAnchorElement,
		)
		const previousContent = element.previousElementSibling

		if (links.length !== 2 || !(previousContent instanceof HTMLElement)) {
			throw new Error('Expected two Hero actions after the final supporting paragraph')
		}

		const styles = getComputedStyle(element)
		const row = element.getBoundingClientRect()
		const [primaryAction, secondaryAction] = links.map((link) => link.getBoundingClientRect())
		const previous = previousContent.getBoundingClientRect()

		return {
			alignItems: styles.alignItems,
			columnGap: Number.parseFloat(styles.columnGap),
			direction: styles.flexDirection,
			paragraphGap: primaryAction.top - previous.bottom,
			primary: primaryAction.toJSON(),
			row: row.toJSON(),
			rowGap: Number.parseFloat(styles.rowGap),
			secondary: secondaryAction.toJSON(),
		}
	})

	expect.soft(layout.alignItems).toBe('flex-start')
	expect.soft(layout.direction).toBe(expectation.direction)
	expect.soft(layout.paragraphGap).toBeCloseTo(expectation.paragraphGap, 5)
	expect.soft(layout.primary.width).toBeLessThan(layout.row.width)
	expect.soft(layout.secondary.width).toBeLessThan(layout.row.width)

	if (expectation.direction === 'row') {
		expect.soft(layout.columnGap).toBe(expectation.gap)
		expect.soft(layout.primary.y).toBeCloseTo(layout.secondary.y, 5)
		expect
			.soft(layout.secondary.x - (layout.primary.x + layout.primary.width))
			.toBeCloseTo(expectation.gap, 5)
	} else {
		expect.soft(layout.rowGap).toBe(expectation.gap)
		expect.soft(layout.primary.x).toBeCloseTo(layout.row.x, 5)
		expect.soft(layout.secondary.x).toBeCloseTo(layout.row.x, 5)
		expect
			.soft(layout.secondary.y - (layout.primary.y + layout.primary.height))
			.toBeCloseTo(expectation.gap, 5)
	}

	await expect(secondary).toBeVisible()
}

async function expectHugLeftAlignedButton(link: Locator) {
	await expect(link).toBeVisible()

	const layout = await link.evaluate((element) => {
		const parent = element.parentElement
		if (!parent) throw new Error('Expected CTA layout parent')

		return {
			button: element.getBoundingClientRect().toJSON(),
			parent: parent.getBoundingClientRect().toJSON(),
		}
	})

	expect.soft(layout.button.x).toBeCloseTo(layout.parent.x, 5)
	expect.soft(layout.button.width).toBeLessThan(layout.parent.width)
	expect
		.soft(layout.button.x + layout.button.width)
		.toBeLessThanOrEqual(layout.parent.x + layout.parent.width)
}

for (const locale of localeExpectations) {
	test.describe(`Home CTA contract at ${locale.path}`, () => {
		test('uses approved large CTAs on desktop with localized destinations', async ({ page }) => {
			await page.setViewportSize({ width: 1440, height: 900 })
			const response = await page.goto(locale.path)
			expect(response?.status()).toBe(200)

			const ctas = getHomeCtas(page, locale)

			await expect(ctas.heroPrimary).toHaveAttribute('href', locale.hrefs.flagship)
			await expect(ctas.heroSecondary).toHaveAttribute('href', locale.hrefs.experience)
			await expect(ctas.flagship).toHaveAttribute('href', locale.hrefs.flagship)
			await expect(ctas.experience).toHaveAttribute('href', locale.hrefs.experience)
			await expect(ctas.final).toHaveAttribute('href', locale.hrefs.contact)

			for (const cta of Object.values(ctas)) {
				await expectLargeButtonContract(cta)
			}

			await expectHeroActionLayout(ctas.heroPrimary, ctas.heroSecondary, {
				direction: 'row',
				gap: 16,
				paragraphGap: 32,
			})
			await expectHugLeftAlignedButton(ctas.flagship)
			await expectHugLeftAlignedButton(ctas.experience)
			await expectHugLeftAlignedButton(ctas.final)
		})

		for (const viewport of [
			{ height: 1024, width: 768 },
			{ height: 844, width: 390 },
		]) {
			test(`uses non-wrapping large CTAs at ${viewport.width}px`, async ({ page }) => {
				await page.setViewportSize(viewport)
				const response = await page.goto(locale.path)
				expect(response?.status()).toBe(200)

				const ctas = getHomeCtas(page, locale)
				await expect(ctas.heroPrimary).toHaveAttribute('href', locale.hrefs.flagship)
				await expect(ctas.heroSecondary).toHaveAttribute('href', locale.hrefs.experience)
				await expect(ctas.flagship).toHaveAttribute('href', locale.hrefs.flagship)
				await expect(ctas.final).toHaveAttribute('href', locale.hrefs.contact)

				for (const cta of [ctas.heroPrimary, ctas.heroSecondary, ctas.flagship, ctas.final]) {
					await expectLargeButtonContract(cta)
				}

				await expectHeroActionLayout(ctas.heroPrimary, ctas.heroSecondary, {
					direction: 'column',
					gap: 24,
					paragraphGap: 24,
				})
				await expectHugLeftAlignedButton(ctas.flagship)
				await expectHugLeftAlignedButton(ctas.final)
				await expect(ctas.experience).toBeHidden()
			})
		}
	})
}

test('keeps the long Czech Hero actions inside a 320px reflow viewport', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 900 })
	const response = await page.goto('/cs')
	expect(response?.status()).toBe(200)

	const expectation = localeExpectations[1]
	const ctas = getHomeCtas(page, expectation)

	await expect(ctas.heroPrimary).toBeVisible()
	await expect(ctas.heroSecondary).toBeVisible()
	await expect(ctas.heroPrimary).toHaveAttribute('href', expectation.hrefs.flagship)
	await expect(ctas.heroSecondary).toHaveAttribute('href', expectation.hrefs.experience)

	const reflow = await ctas.heroPrimary.locator('..').evaluate((element) => {
		const links = Array.from(element.children).filter(
			(child): child is HTMLAnchorElement => child instanceof HTMLAnchorElement,
		)
		if (links.length !== 2) throw new Error('Expected two Czech Hero actions')

		const styles = getComputedStyle(element)
		const viewportWidth = document.documentElement.clientWidth

		return {
			alignItems: styles.alignItems,
			direction: styles.flexDirection,
			documentScrollWidth: document.documentElement.scrollWidth,
			links: links.map((link) => link.getBoundingClientRect().toJSON()),
			row: element.getBoundingClientRect().toJSON(),
			rowGap: Number.parseFloat(styles.rowGap),
			viewportWidth,
		}
	})

	expect(reflow.alignItems).toBe('flex-start')
	expect(reflow.direction).toBe('column')
	expect(reflow.rowGap).toBe(24)
	expect(reflow.documentScrollWidth).toBeLessThanOrEqual(reflow.viewportWidth)
	expect(reflow.links[0].y).toBeLessThan(reflow.links[1].y)

	for (const link of reflow.links) {
		expect(link.height).toBeGreaterThanOrEqual(52)
		expect(link.x).toBeGreaterThanOrEqual(reflow.row.x)
		expect(link.x + link.width).toBeLessThanOrEqual(reflow.row.x + reflow.row.width)
		expect(link.x + link.width).toBeLessThanOrEqual(reflow.viewportWidth)
	}
})

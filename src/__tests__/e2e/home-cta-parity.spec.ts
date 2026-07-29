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

				await expect(ctas.experience).toBeHidden()
			})
		}
	})
}

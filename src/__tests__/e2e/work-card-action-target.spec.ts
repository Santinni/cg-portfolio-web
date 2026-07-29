import { expect, type Locator, type Page, test } from '@playwright/test'

import { expectPx } from './support/home-parity'

const homeLocales = [
	{ actionLabel: 'Read case', path: '/' },
	{ actionLabel: 'Přečíst studii', path: '/cs' },
] as const

const workLocales = [
	{ actionLabel: 'Read case', path: '/work' },
	{ actionLabel: 'Přečíst studii', path: '/cs/work' },
] as const

const homeViewports = [
	{ height: 900, width: 1440 },
	{ height: 1024, width: 768 },
	{ height: 932, width: 430 },
	{ height: 844, width: 390 },
	{ height: 900, width: 320 },
] as const

async function expectWorkCardActionContract(link: Locator) {
	await expect(link).toBeVisible()

	const contract = await link.evaluate((element) => {
		const icon = element.querySelector('svg')
		const parent = element.parentElement
		const textNode = Array.from(element.childNodes).find(
			(node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
		)

		if (!(icon instanceof SVGElement) || !parent || !textNode) {
			throw new Error('Expected a WorkCard action with direct text, icon and card parent')
		}

		const styles = getComputedStyle(element)
		const actionRect = element.getBoundingClientRect()
		const iconRect = icon.getBoundingClientRect()
		const parentRect = parent.getBoundingClientRect()
		const parentStyles = getComputedStyle(parent)
		const textRange = document.createRange()
		textRange.selectNodeContents(textNode)
		const textRect = textRange.getBoundingClientRect()
		const gap = Number.parseFloat(styles.columnGap)
		const paddingInlineEnd = Number.parseFloat(styles.paddingInlineEnd)
		const paddingInlineStart = Number.parseFloat(styles.paddingInlineStart)

		return {
			action: actionRect.toJSON(),
			borderRadius: Number.parseFloat(styles.borderStartStartRadius),
			expectedHugWidth:
				textRect.width + iconRect.width + gap + paddingInlineStart + paddingInlineEnd,
			fontSize: styles.fontSize,
			fontWeight: styles.fontWeight,
			gap,
			icon: iconRect.toJSON(),
			lineHeight: styles.lineHeight,
			overflow: {
				clientWidth: element.clientWidth,
				scrollWidth: element.scrollWidth,
			},
			paddingInlineEnd,
			paddingInlineStart,
			parent: parentRect.toJSON(),
			parentContentStart:
				parentRect.x +
				Number.parseFloat(parentStyles.borderInlineStartWidth) +
				Number.parseFloat(parentStyles.paddingInlineStart),
		}
	})

	expect(contract.action.height).toBe(44)
	expect(Math.abs(contract.action.width - contract.expectedHugWidth)).toBeLessThanOrEqual(1)
	expect(contract.action.width).toBeLessThan(contract.parent.width)
	expectPx(contract.action.x, contract.parentContentStart)
	expect(contract.action.x + contract.action.width).toBeLessThanOrEqual(
		contract.parent.x + contract.parent.width,
	)
	expect(contract.overflow.scrollWidth).toBeLessThanOrEqual(contract.overflow.clientWidth)
	expect(contract.paddingInlineStart).toBe(8)
	expect(contract.paddingInlineEnd).toBe(8)
	expect(contract.gap).toBe(4)
	expect(contract.borderRadius).toBe(4)
	expect(contract.fontSize).toBe('16px')
	expect(contract.lineHeight).toBe('24px')
	expect(contract.fontWeight).toBe('500')
	expect(contract.icon).toMatchObject({ height: 16, width: 16 })
}

async function expectStandardWorkCardLayoutContract(
	card: Locator,
	flow: 'equal-height-grid' | 'natural',
) {
	await expect(card).toBeVisible()

	const contract = await card.evaluate((element) => {
		const content = element.querySelector('[data-work-card-content]')
		const action = element.querySelector('[data-work-card-action], [data-work-card-pending]')

		if (!(content instanceof HTMLElement) || !(action instanceof HTMLElement)) {
			throw new Error('Expected a standard WorkCard with content and an action or pending state')
		}

		const cardRect = element.getBoundingClientRect()
		const cardStyles = getComputedStyle(element)
		const contentChildren = Array.from(content.children).filter(
			(child): child is HTMLElement =>
				child instanceof HTMLElement && getComputedStyle(child).display !== 'none',
		)
		const contentGaps = contentChildren.slice(1).map((child, index) => {
			const previousRect = contentChildren[index].getBoundingClientRect()
			return child.getBoundingClientRect().top - previousRect.bottom
		})
		const contentRect = content.getBoundingClientRect()
		const actionRect = action.getBoundingClientRect()
		const paddingBottom = Number.parseFloat(cardStyles.paddingBottom)
		const borderBottom = Number.parseFloat(cardStyles.borderBottomWidth)

		return {
			actionBottom: actionRect.bottom,
			actionGap: actionRect.top - contentRect.bottom,
			cardInnerBottom: cardRect.bottom - borderBottom - paddingBottom,
			contentGaps,
			overflow: {
				clientHeight: element.clientHeight,
				clientWidth: element.clientWidth,
				scrollHeight: element.scrollHeight,
				scrollWidth: element.scrollWidth,
			},
			padding: {
				bottom: paddingBottom,
				left: Number.parseFloat(cardStyles.paddingLeft),
				right: Number.parseFloat(cardStyles.paddingRight),
				top: Number.parseFloat(cardStyles.paddingTop),
			},
		}
	})

	expect(contract.padding).toEqual({ bottom: 24, left: 24, right: 24, top: 24 })
	expect(contract.contentGaps.length).toBeGreaterThan(0)
	for (const gap of contract.contentGaps) {
		if (flow === 'natural') expectPx(gap, 12)
		else expect(gap).toBeGreaterThanOrEqual(12)
	}
	if (flow === 'natural') expectPx(contract.actionGap, 12)
	else {
		expect(contract.actionGap).toBeGreaterThanOrEqual(12)
		expectPx(contract.actionBottom, contract.cardInnerBottom)
	}
	expect(contract.overflow.scrollWidth).toBeLessThanOrEqual(contract.overflow.clientWidth)
	expect(contract.overflow.scrollHeight).toBeLessThanOrEqual(contract.overflow.clientHeight)
}

async function expectStandardWorkCardParts(page: Page) {
	await expect(page.locator('main [data-work-card-action]')).toHaveCount(3)
	await expect(page.locator('main [data-work-card-pending]')).toHaveCount(1)
}

async function focusByKeyboard(page: Page, target: Locator) {
	await page.evaluate(() => {
		if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
	})

	for (let index = 0; index < 30; index += 1) {
		await page.keyboard.press('Tab')
		if (await target.evaluate((element) => document.activeElement === element)) return
	}

	throw new Error('Could not reach the WorkCard action using keyboard navigation')
}

for (const locale of homeLocales) {
	test.describe(`Home WorkCard actions at ${locale.path}`, () => {
		for (const viewport of homeViewports) {
			test(`match the Figma target contract at ${viewport.width}px`, async ({ page }) => {
				await page.setViewportSize(viewport)
				const response = await page.goto(locale.path)
				expect(response?.status()).toBe(200)

				const actions = page
					.locator('#selected-work')
					.getByRole('link', { exact: true, name: locale.actionLabel })
				await expect(actions).toHaveCount(2)

				for (const action of await actions.all()) {
					await expectWorkCardActionContract(action)
				}
			})
		}
	})
}

for (const locale of workLocales) {
	test(`keeps the WorkCard action contract on ${locale.path}`, async ({ page }) => {
		await page.setViewportSize({ height: 900, width: 1440 })
		const response = await page.goto(locale.path)
		expect(response?.status()).toBe(200)

		const actions = page
			.locator('main')
			.getByRole('link', { exact: true, name: locale.actionLabel })
		await expect(actions).toHaveCount(3)

		for (const action of await actions.all()) {
			await expectWorkCardActionContract(action)
		}
	})

	test(`keeps the standard WorkCard layout contract on ${locale.path}`, async ({ page }) => {
		await page.setViewportSize({ height: 900, width: 1440 })
		const response = await page.goto(locale.path)
		expect(response?.status()).toBe(200)

		const cards = page.locator('main article[data-work-key]')
		await expect(cards).toHaveCount(4)
		await expectStandardWorkCardParts(page)

		for (const card of await cards.all()) {
			await expectStandardWorkCardLayoutContract(card, 'equal-height-grid')
		}
	})

	test(`keeps natural standard WorkCard gaps on ${locale.path} at 390px`, async ({ page }) => {
		await page.setViewportSize({ height: 844, width: 390 })
		const response = await page.goto(locale.path)
		expect(response?.status()).toBe(200)

		const cards = page.locator('main article[data-work-key]')
		await expect(cards).toHaveCount(4)
		await expectStandardWorkCardParts(page)

		for (const card of await cards.all()) {
			await expectStandardWorkCardLayoutContract(card, 'natural')
		}
	})
}

test('uses the approved hover and keyboard-focus states without geometry shift', async ({
	page,
}) => {
	await page.setViewportSize({ height: 900, width: 1440 })
	await page.goto('/')

	const action = page
		.locator('#selected-work')
		.getByRole('link', { exact: true, name: 'Read case' })
		.first()
	const initial = await action.evaluate((element) => {
		const styles = getComputedStyle(element)
		return {
			color: styles.color,
			height: element.getBoundingClientRect().height,
			width: element.getBoundingClientRect().width,
		}
	})

	await action.hover()
	await expect
		.poll(() =>
			action.evaluate((element) => ({
				color: getComputedStyle(element).color,
				textDecoration: getComputedStyle(element).textDecorationLine,
			})),
		)
		.toEqual({
			color: initial.color,
			textDecoration: 'underline',
		})

	await page.mouse.move(0, 0)
	await focusByKeyboard(page, action)
	await expect(action).toBeFocused()

	const focus = await action.evaluate((element) => {
		const styles = getComputedStyle(element)
		const rect = element.getBoundingClientRect()
		return {
			height: rect.height,
			outlineColor: styles.outlineColor,
			outlineStyle: styles.outlineStyle,
			outlineWidth: styles.outlineWidth,
			width: rect.width,
		}
	})

	expect(focus).toMatchObject({
		height: initial.height,
		outlineColor: 'rgb(10, 110, 128)',
		outlineStyle: 'solid',
		outlineWidth: '2px',
		width: initial.width,
	})
})

test('keeps the keyboard focus distinct in forced-colors mode', async ({ page }) => {
	await page.emulateMedia({ forcedColors: 'active' })
	await page.setViewportSize({ height: 900, width: 1440 })
	await page.goto('/')

	const action = page
		.locator('#selected-work')
		.getByRole('link', { exact: true, name: 'Read case' })
		.first()
	await focusByKeyboard(page, action)
	await expect(action).toBeFocused()

	const forcedColors = await action.evaluate((element) => {
		const styles = getComputedStyle(element)
		return {
			canvasColor: getComputedStyle(document.body).backgroundColor,
			outlineColor: styles.outlineColor,
			outlineStyle: styles.outlineStyle,
			outlineWidth: styles.outlineWidth,
		}
	})

	expect(forcedColors).toMatchObject({
		outlineStyle: 'solid',
		outlineWidth: '2px',
	})
	expect(forcedColors.outlineColor).not.toBe('rgba(0, 0, 0, 0)')
	expect(forcedColors.outlineColor).not.toBe(forcedColors.canvasColor)
})

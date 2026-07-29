import { expect, type Locator, type Page, test } from '@playwright/test'

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
	{ height: 844, width: 390 },
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
	expect(contract.action.x).toBeCloseTo(contract.parentContentStart, 5)
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

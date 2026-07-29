import { expect, test } from '@playwright/test'

const launchRoutes = ['/', '/work', '/experience', '/about', '/contact', '/insights']

test.describe('public launch surface', () => {
	test('every primary route renders a usable document', async ({ page }) => {
		for (const route of launchRoutes) {
			const response = await page.goto(route)

			expect(response?.status(), `${route} should return HTTP 200`).toBe(200)
			await expect(page.locator('main h1')).toBeVisible()
			await expect(page.locator('main h1')).toHaveCount(1)
			await expect(page.getByText(/application error|internal server error/i)).toHaveCount(0)
		}
	})

	test('skip link moves keyboard focus to the main content', async ({ page }) => {
		await page.goto('/')
		await page.keyboard.press('Tab')

		const skipLink = page.getByRole('link', { name: 'Skip to main content' })
		await expect(skipLink).toBeFocused()
		await page.keyboard.press('Enter')
		await expect(page.locator('#main-content')).toBeFocused()
	})

	test('health endpoint exposes the running revision contract', async ({ request }) => {
		const response = await request.get('/api/health')
		const body = await response.json()

		expect(response.ok()).toBeTruthy()
		expect(body.status).toBe('ok')
		expect(body.revision).toBeTruthy()
		expect(body.timestamp).toBeTruthy()
		expect(body.checks.database).toBe('skipped')

		const readinessResponse = await request.get('/api/health?deep=1')
		const readinessBody = await readinessResponse.json()

		expect(readinessResponse.ok()).toBeTruthy()
		expect(readinessBody.status).toBe('ok')
		expect(readinessBody.checks.database).toBe('ok')
	})
})

test.describe('work case studies', () => {
	test('publishes exactly three finished cases and keeps Accessibility pending', async ({
		page,
	}) => {
		await page.goto('/work')

		const caseLinks = page.locator('main a[href^="/work/"]')
		await expect(caseLinks).toHaveCount(3)

		const pending = page.getByText('Case study coming soon')
		await expect(pending).toBeVisible()
		expect(await pending.evaluate((element) => element.closest('a'))).toBeNull()
	})

	test('all finished cases render and an unknown case uses the custom 404', async ({ page }) => {
		for (const slug of [
			'energy-customer-portal',
			'maintenance-applications',
			'distributed-energy-platform',
		]) {
			const response = await page.goto(`/work/${slug}`)
			expect(response?.status()).toBe(200)
			await expect(page.locator('main h1')).toBeVisible()
		}

		const missingResponse = await page.goto('/work/not-a-real-case')
		expect(missingResponse?.status()).toBe(404)
		await expect(
			page.getByRole('heading', { name: 'This page is not part of the system.' }),
		).toBeVisible()
	})
})

test.describe('responsive shell interactions', () => {
	test('desktop navigation exposes every primary destination', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/')

		const navigation = page.getByRole('navigation')
		for (const label of ['Work', 'Experience', 'About', 'Contact', 'Insights']) {
			await expect(navigation.getByRole('link', { name: label, exact: true })).toBeVisible()
		}
	})

	test('navigation exposes the current static route across locales, queries and fragments', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 })

		for (const route of [
			{ href: '/?source=navigation#main-content', label: 'Codeguy – Home' },
			{ href: '/cs/work?source=navigation#main-content', label: 'Projekty' },
		]) {
			await page.goto(route.href)

			const navigation = page.getByRole('navigation')
			await expect(navigation.getByRole('link', { name: route.label })).toHaveAttribute(
				'aria-current',
				'page',
			)
			await expect(navigation.locator('a[aria-current="page"]')).toHaveCount(1)
			expect(page.url()).toContain('?source=navigation#main-content')
		}
	})

	test('navigation surface transitions without changing responsive geometry', async ({ page }) => {
		for (const theme of ['light', 'dark'] as const) {
			for (const viewport of [
				{ width: 390, height: 844 },
				{ width: 768, height: 900 },
				{ width: 1440, height: 900 },
			]) {
				await page.setViewportSize(viewport)
				await page.goto('/')
				await page.evaluate((selectedTheme) => {
					document.documentElement.dataset.theme = selectedTheme
					document.documentElement.style.scrollBehavior = 'auto'
					window.scrollTo(0, 0)
				}, theme)

				const navigation = page.getByRole('navigation')
				const readSurface = () =>
					navigation.evaluate((element) => {
						const wrapper = element.firstElementChild as HTMLElement
						const navStyle = getComputedStyle(element)
						const wrapperStyle = getComputedStyle(wrapper)
						const resolveTokenColor = (token: string) => {
							const probe = document.createElement('div')
							probe.style.backgroundColor = `var(${token})`
							document.body.append(probe)
							const color = getComputedStyle(probe).backgroundColor
							probe.remove()
							return color
						}

						return {
							borderColor: resolveTokenColor('--border-default'),
							navBackdrop: navStyle.backdropFilter,
							navBackground: navStyle.backgroundColor,
							navBorderColor: navStyle.borderBottomColor,
							navBorderWidth: Number.parseFloat(navStyle.borderBottomWidth),
							navBoxShadow: navStyle.boxShadow,
							navHeight: element.getBoundingClientRect().height,
							scrolled: element.getAttribute('data-scrolled'),
							surfaceColor: resolveTokenColor('--surface-page'),
							wrapperBackground: wrapperStyle.backgroundColor,
							wrapperBorderColor: wrapperStyle.borderBottomColor,
							wrapperBorderWidth: Number.parseFloat(wrapperStyle.borderBottomWidth),
							wrapperHeight: wrapper.getBoundingClientRect().height,
							wrapperWidth: wrapper.getBoundingClientRect().width,
						}
					})

				await expect(navigation).toHaveAttribute('data-scrolled', 'false')
				const top = await readSurface()
				const expectedHeight = viewport.width >= 1024 ? 72 : 64

				expect(top.navHeight).toBe(expectedHeight)
				expect(top.wrapperHeight).toBe(expectedHeight)
				expect(top.navBackground).toBe('rgba(0, 0, 0, 0)')
				expect(top.wrapperBackground).toBe('rgba(0, 0, 0, 0)')
				expect(top.navBorderWidth).toBe(0)
				expect(top.wrapperBorderWidth).toBe(0)
				expect(top.navBackdrop).toBe('none')
				expect(top.navBoxShadow).toBe('none')

				await page.evaluate(() => window.scrollTo(0, 320))
				await expect(navigation).toHaveAttribute('data-scrolled', 'true')
				const scrolled = await readSurface()

				expect(scrolled.navHeight).toBe(top.navHeight)
				expect(scrolled.wrapperHeight).toBe(top.wrapperHeight)
				if (viewport.width >= 1024) {
					expect(scrolled.navBackground).toBe('rgba(0, 0, 0, 0)')
					expect(scrolled.navBorderWidth).toBe(0)
					expect(scrolled.wrapperBackground).toBe(scrolled.surfaceColor)
					expect(scrolled.wrapperBorderWidth).toBe(1)
					expect(scrolled.wrapperBorderColor).toBe(scrolled.borderColor)
					expect(scrolled.wrapperWidth).toBe(1200)
				} else {
					expect(scrolled.navBackground).toBe(scrolled.surfaceColor)
					expect(scrolled.navBorderWidth).toBe(1)
					expect(scrolled.navBorderColor).toBe(scrolled.borderColor)
					expect(scrolled.wrapperBackground).toBe('rgba(0, 0, 0, 0)')
					expect(scrolled.wrapperBorderWidth).toBe(0)
				}

				await page.evaluate(() => window.scrollTo(0, 0))
				await expect(navigation).toHaveAttribute('data-scrolled', 'false')
				const returned = await readSurface()

				expect(returned.navHeight).toBe(top.navHeight)
				expect(returned.wrapperHeight).toBe(top.wrapperHeight)
				expect(returned.navBackground).toBe(top.navBackground)
				expect(returned.wrapperBackground).toBe(top.wrapperBackground)
				expect(returned.navBorderWidth).toBe(0)
				expect(returned.wrapperBorderWidth).toBe(0)
			}
		}
	})

	test('mobile menu preserves native close behavior across close, Escape, resize and navigation', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 390, height: 844 })
		await page.goto('/')

		const trigger = page.getByRole('button', { name: 'Open menu' })
		const dialog = page.getByRole('dialog', { name: 'Site menu' })
		const nativeDialog = page.locator('dialog[aria-label="Site menu"]')
		const nativeTrigger = page.locator('button[aria-label="Open menu"]')

		await trigger.click()
		await expect(dialog).toBeVisible()
		await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused()
		expect(await page.locator('body').evaluate((body) => body.style.overflow)).toBe('hidden')

		await page.getByRole('button', { name: 'Close menu' }).click()
		await expect(dialog).not.toBeVisible()
		await expect(trigger).toBeFocused()
		expect(await page.locator('body').evaluate((body) => body.style.overflow)).toBe('')

		await trigger.click()
		await page.keyboard.press('Escape')
		await expect(dialog).not.toBeVisible()
		await expect(trigger).toBeFocused()
		expect(await page.locator('body').evaluate((body) => body.style.overflow)).toBe('')

		await trigger.click()
		await page.setViewportSize({ width: 1440, height: 900 })
		await expect
			.poll(() => nativeDialog.evaluate((element: HTMLDialogElement) => element.open))
			.toBe(false)
		await expect(nativeTrigger).not.toBeFocused()
		expect(await page.locator('body').evaluate((body) => body.style.overflow)).toBe('')

		await page.setViewportSize({ width: 390, height: 844 })
		await trigger.click()
		await dialog.getByRole('link', { name: 'Work', exact: true }).click()
		await page.waitForURL('**/work')
		await expect
			.poll(() => nativeDialog.evaluate((element: HTMLDialogElement) => element.open))
			.toBe(false)
		expect(await page.locator('body').evaluate((body) => body.style.overflow)).toBe('')
		await expect
			.poll(() => nativeDialog.evaluate((element) => !element.contains(document.activeElement)))
			.toBe(true)
	})

	test('theme choice changes and persists across reloads', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/')
		await page.evaluate(() => localStorage.removeItem('codeguy-theme'))
		await page.reload()

		const initialTheme = await page.locator('html').getAttribute('data-theme')
		await page.locator('button[aria-label="Toggle color theme"]:visible').click()
		const selectedTheme = await page.locator('html').getAttribute('data-theme')

		expect(selectedTheme).not.toBe(initialTheme)
		await page.reload()
		await expect(page.locator('html')).toHaveAttribute('data-theme', selectedTheme || 'light')
	})

	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		test(`has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
			await page.setViewportSize(viewport)

			for (const route of launchRoutes) {
				await page.goto(route)
				const dimensions = await page.evaluate(() => ({
					clientWidth: document.documentElement.clientWidth,
					scrollWidth: document.documentElement.scrollWidth,
				}))
				expect(
					dimensions.scrollWidth,
					`${route} overflows at ${viewport.width}px`,
				).toBeLessThanOrEqual(dimensions.clientWidth)
			}
		})
	}
})

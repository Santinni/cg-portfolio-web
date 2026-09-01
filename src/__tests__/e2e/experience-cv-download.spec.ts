import { expect, type Page, test } from '@playwright/test'

const experienceLocales = [
	{
		id: 'en',
		path: '/experience',
		lang: 'en',
		downloadAccessibleName: 'Download CV — Karel Kutchan',
		pdfHref: '/curriculum-vitae/CV_Karel_Kutchan.pdf',
		filename: 'CV_Karel_Kutchan.pdf',
	},
	{
		id: 'cs',
		path: '/cs/experience',
		lang: 'cs',
		downloadAccessibleName: 'Stáhnout životopis Karla Kutchana',
		pdfHref: '/curriculum-vitae/CV_Karel_Kutchan_CS.pdf',
		filename: 'CV_Karel_Kutchan_CS.pdf',
	},
] as const

function getExperienceDownload(page: Page, label: string) {
	return page.getByRole('link', { exact: true, name: label })
}

for (const locale of experienceLocales) {
	test.describe(`${locale.id.toUpperCase()} Experience CV download`, () => {
		test('points the capabilities download at the locale-specific PDF', async ({ page }) => {
			const response = await page.goto(locale.path)

			expect(response?.status()).toBe(200)
			await expect(page.locator('html')).toHaveAttribute('lang', locale.lang)

			const download = getExperienceDownload(page, locale.downloadAccessibleName)
			await expect(download).toHaveCount(1)
			await expect(download).toHaveAttribute('href', locale.pdfHref)
			await expect(download).toHaveAttribute('download', locale.filename)

			const pdfHrefs = await page
				.locator('a[href$=".pdf"]')
				.evaluateAll((links) => links.map((link) => link.getAttribute('href')))
			expect(pdfHrefs).toEqual([locale.pdfHref])
		})

		test('downloads the locale-specific PDF without leaving the route', async ({ page }) => {
			await page.goto(locale.path)
			const pathnameBeforeDownload = new URL(page.url()).pathname

			const downloadPromise = page.waitForEvent('download')
			await getExperienceDownload(page, locale.downloadAccessibleName).click()
			const download = await downloadPromise

			try {
				expect(new URL(download.url()).pathname).toBe(locale.pdfHref)
				expect(download.suggestedFilename()).toBe(locale.filename)
				expect(new URL(page.url()).pathname).toBe(pathnameBeforeDownload)
			} finally {
				await download.delete()
			}
		})
	})
}

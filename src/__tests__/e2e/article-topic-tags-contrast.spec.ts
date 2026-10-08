import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test, type Page } from '@playwright/test'

/**
 * Article topic tags render with the design-system Button (secondary, small) in two
 * contexts: on article cards (raised surface) and inside the article hero (contrast
 * surface, dark in both themes). The pinned database holds no posts, so no article route
 * renders in e2e; this harness loads the real stylesheets against the real markup shape
 * and measures computed colours, the way `share-bar-contrast.spec.ts` does. Ratios only,
 * so it is a functional spec and runs on every engine.
 */
const minimumTextContrast = 4.5
const minimumBorderContrast = 3

const root = process.cwd()
const [variablesCss, buttonCss, articleCss, articlePageCss] = await Promise.all([
	readFile(path.resolve(root, 'src/app/(frontend)/styles/variables.css'), 'utf8'),
	readFile(
		path.resolve(root, 'src/app/(frontend)/components/primitives/button/Button.module.css'),
		'utf8',
	),
	readFile(path.resolve(root, 'src/components/article/Article.module.css'), 'utf8'),
	readFile(
		path.resolve(
			root,
			'src/app/[locale]/(frontend)/(pages)/insights/[slug]/InsightArticlePage.module.css',
		),
		'utf8',
	),
])

// CSS Modules syntax: the browser drops a rule it cannot parse, so unwrap `:global(…)`.
const articlePagePlainCss = articlePageCss.replace(/:global\(([^)]*)\)/g, '$1')

type Rgb = { red: number; green: number; blue: number }

function parseRgb(color: string): Rgb {
	const channels = color
		.match(/[\d.]+/g)
		?.slice(0, 3)
		.map(Number)
	if (!channels || channels.length !== 3) {
		throw new Error(`Expected a computed RGB color, received "${color}"`)
	}
	return { red: channels[0], green: channels[1], blue: channels[2] }
}

function relativeLuminance({ red, green, blue }: Rgb) {
	const linearize = (channel: number) => {
		const value = channel / 255
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
	}
	return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue)
}

function contrastRatio(foreground: string, background: string) {
	const a = relativeLuminance(parseRgb(foreground))
	const b = relativeLuminance(parseRgb(background))
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

async function renderTagHarness(page: Page, theme: 'dark' | 'light') {
	await page.setContent(`
		<!doctype html>
		<html data-theme="${theme}">
			<body>
				<article id="card" class="card">
					<ul class="topics" aria-label="Article topics" data-article-topics>
						<li><a id="card-tag" class="button variant-secondary size-small" href="/insights?topic=ai-workflows" lang="en"><span class="buttonContent">AI workflows</span></a></li>
					</ul>
				</article>
				<header id="hero" class="hero">
					<div class="heroInner">
						<ul class="topics" aria-label="Article topics" data-article-topics>
							<li><a id="hero-tag" class="button variant-secondary size-small" href="/insights?topic=ai-workflows" lang="en"><span class="buttonContent">AI workflows</span></a></li>
						</ul>
					</div>
				</header>
			</body>
		</html>
	`)
	await page.addStyleTag({ content: variablesCss })
	await page.addStyleTag({
		content:
			'* { transition-duration: 0s !important; } body { margin: 0; padding: 24px; background: var(--surface-page); }',
	})
	await page.addStyleTag({ content: buttonCss })
	await page.addStyleTag({ content: articleCss })
	await page.addStyleTag({ content: articlePagePlainCss })
}

/** Computed colours of the tag; a transparent tag background falls through to its container. */
async function tagColors(page: Page, selector: string) {
	return page.locator(selector).evaluate((element) => {
		const styles = getComputedStyle(element)
		let background = styles.backgroundColor
		let parent = element.parentElement
		while (parent && (background === 'rgba(0, 0, 0, 0)' || background === 'transparent')) {
			background = getComputedStyle(parent).backgroundColor
			parent = parent.parentElement
		}
		return {
			background,
			border: styles.borderTopColor,
			borderWidth: styles.borderTopWidth,
			foreground: styles.color,
			outline: styles.outlineColor,
		}
	})
}

test.describe('Article topic tag contrast harness', () => {
	for (const theme of ['light', 'dark'] as const) {
		test(`keeps card and hero tags readable at rest, on hover and on focus in the ${theme} theme`, async ({
			page,
		}) => {
			await renderTagHarness(page, theme)

			for (const id of ['#card-tag', '#hero-tag'] as const) {
				const rest = await tagColors(page, id)
				expect(
					contrastRatio(rest.foreground, rest.background),
					`${theme} ${id} rest ${JSON.stringify(rest)}`,
				).toBeGreaterThanOrEqual(minimumTextContrast)
				expect(rest.borderWidth, `${theme} ${id} has the secondary border`).not.toBe('0px')
				expect(
					contrastRatio(rest.border, rest.background),
					`${theme} ${id} border ${JSON.stringify(rest)}`,
				).toBeGreaterThanOrEqual(minimumBorderContrast)

				await page.locator(id).hover()
				const hover = await tagColors(page, id)
				expect(hover.background, `${theme} ${id} hover changes the surface`).not.toBe(
					rest.background,
				)
				expect(
					contrastRatio(hover.foreground, hover.background),
					`${theme} ${id} hover ${JSON.stringify(hover)}`,
				).toBeGreaterThanOrEqual(minimumTextContrast)
				await page.mouse.move(0, 0)

				await page.locator(id).focus()
				const focused = await tagColors(page, id)
				expect(
					contrastRatio(focused.outline, rest.background),
					`${theme} ${id} focus ring ${JSON.stringify(focused)}`,
				).toBeGreaterThanOrEqual(minimumBorderContrast)
			}
		})
	}

	test('gives hero tags the on-contrast focus ring instead of the page accent', async ({
		page,
	}) => {
		await renderTagHarness(page, 'light')
		await page.locator('#hero-tag').focus()
		const hero = await tagColors(page, '#hero-tag')
		await page.locator('#card-tag').focus()
		const card = await tagColors(page, '#card-tag')

		// Light theme: the page accent (#0a6e80) would sit at 3.4:1 on the hero; the hero
		// rule swaps the ring to --accent-on-contrast (#22d3ee).
		expect(hero.outline).toBe('rgb(34, 211, 238)')
		expect(card.outline).toBe('rgb(10, 110, 128)')
	})
})

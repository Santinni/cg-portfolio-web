#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

// @playwright/test re-exports the browser API; the bare `playwright` package is
// not a direct dependency of this repo.
import { chromium } from '@playwright/test'

import { loadFacts, loadMessages, loadVariant } from './data.mjs'
import { renderCv } from './render.mjs'
import { loadLightTokens, resolveToken, tokensToCss } from './tokens.mjs'

const here = dirname(fileURLToPath(import.meta.url))

const { values } = parseArgs({
	options: {
		locale: { type: 'string', default: 'en' },
		variant: { type: 'string' },
		out: { type: 'string' },
		html: { type: 'boolean', default: false },
	},
})

if (!['en', 'cs'].includes(values.locale)) {
	console.error(`Unknown locale "${values.locale}". Use en or cs.`)
	process.exit(1)
}

/** Inlines the woff2 files so the generated HTML is self-contained. */
async function loadFontCss() {
	let css = await readFile(resolve(here, 'inter.css'), 'utf8')
	for (const match of [...css.matchAll(/url\('\.\/fonts\/([^']+)'\)/g)]) {
		const bytes = await readFile(resolve(here, 'fonts', match[1]))
		css = css.replace(
			match[0],
			`url('data:font/woff2;base64,${bytes.toString('base64')}')`,
		)
	}
	return css
}

const [facts, messages, variant, tokens, fontCss, printCss, qrSvg] = await Promise.all([
	loadFacts(),
	loadMessages(values.locale),
	loadVariant(values.variant),
	loadLightTokens(),
	loadFontCss(),
	readFile(resolve(here, 'cv-print.css'), 'utf8'),
	readFile(resolve(here, 'qr-codeguy.svg'), 'utf8').catch(() => ''),
])

// Fail loudly if the brand accent ever stops resolving to the canonical teal.
// Brand guidelines §10.2: print uses #0A6E80 and never the dark-mode cyan.
const accent = resolveToken(tokens, '--action-primary')?.toLowerCase()
if (accent !== '#0a6e80') {
	console.error(
		`Brand accent resolved to "${accent}", expected #0a6e80.\n` +
			'Print must use the canonical teal (brand guidelines §10.2).',
	)
	process.exit(1)
}

const html = renderCv({
	facts,
	messages,
	variant,
	locale: values.locale,
	tokensCss: tokensToCss(tokens),
	fontCss,
	printCss,
	qrSvg,
})

const slug = variant?.slug ? `-${variant.slug}` : ''
const outPath = resolve(
	process.cwd(),
	values.out ?? resolve(here, `out/CV_Karel_Kutchan_${values.locale}${slug}.pdf`),
)
await mkdir(dirname(outPath), { recursive: true })

if (values.html) {
	const htmlPath = outPath.replace(/\.pdf$/, '.html')
	await writeFile(htmlPath, html, 'utf8')
	console.log(`html    ${basename(htmlPath)}`)
}

const browser = await chromium.launch()
try {
	const page = await browser.newPage()
	await page.setContent(html, { waitUntil: 'load' })
	await page.evaluate(() => document.fonts.ready)
	// Running footer, as in the approved layout. Chrome renders header/footer
	// templates in an isolated context that ignores page CSS, so the styling is
	// inline and the accent is interpolated from the resolved token.
	const headline = variant?.headline ?? messages.hero.role
	const issued = new Intl.DateTimeFormat(values.locale, {
		month: 'long',
		year: 'numeric',
	}).format(new Date())
	const footer = `<div style="width:100%;padding:0 13mm;font-family:Inter,sans-serif;font-size:7pt;line-height:9pt;color:${resolveToken(tokens, '--text-secondary')};display:flex;justify-content:space-between;">
		<span>${facts.curriculumVitae.person.name} — ${headline}</span>
		<span>${issued}</span>
	</div>`

	await page.pdf({
		path: outPath,
		format: 'A4',
		printBackground: true,
		// Margins live in the @page rule so the stylesheet stays the single
		// source of truth for page geometry.
		preferCSSPageSize: true,
		tagged: true,
		displayHeaderFooter: true,
		headerTemplate: '<span></span>',
		footerTemplate: footer,
	})
} finally {
	await browser.close()
}

console.log(`pdf     ${basename(outPath)}`)
console.log(`locale  ${values.locale}`)
console.log(`variant ${variant?.slug ?? '—'}`)
console.log(`accent  ${accent}`)

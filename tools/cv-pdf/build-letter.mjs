#!/usr/bin/env node
/**
 * Renders a cover letter with the CV's identity layer.
 *
 *   node tools/cv-pdf/build-letter.mjs --locale cs --letter ../new_job/cv/letters/<slug>.cs.json
 *
 * Shares build.mjs's guarantees: facts and tokens from the website, Inter
 * vendored, the build fails if the accent is not the canonical teal.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import { chromium } from '@playwright/test'

import { loadFacts, loadMessages } from './data.mjs'
import { renderLetter, validateLetter } from './letter.mjs'
import { loadLightTokens, resolveToken, tokensToCss } from './tokens.mjs'

const here = dirname(fileURLToPath(import.meta.url))

const { values } = parseArgs({
	options: {
		locale: { type: 'string', default: 'en' },
		letter: { type: 'string' },
		out: { type: 'string' },
		html: { type: 'boolean', default: false },
	},
})

if (!['en', 'cs'].includes(values.locale)) {
	console.error(`Unknown locale "${values.locale}". Use en or cs.`)
	process.exit(1)
}
if (!values.letter) {
	console.error('--letter <path> is required.')
	process.exit(1)
}

async function loadFontCss() {
	let css = await readFile(resolve(here, 'inter.css'), 'utf8')
	for (const match of [...css.matchAll(/url\('\.\/fonts\/([^']+)'\)/g)]) {
		const bytes = await readFile(resolve(here, 'fonts', match[1]))
		css = css.replace(match[0], `url('data:font/woff2;base64,${bytes.toString('base64')}')`)
	}
	return css
}

const letterPath = resolve(process.cwd(), values.letter)
const [facts, messages, letter, tokens, fontCss, cvCss, letterCss] = await Promise.all([
	loadFacts(),
	loadMessages(values.locale),
	readFile(letterPath, 'utf8').then((raw) => validateLetter(JSON.parse(raw), values.letter)),
	loadLightTokens(),
	loadFontCss(),
	readFile(resolve(here, 'cv-print.css'), 'utf8'),
	readFile(resolve(here, 'letter-print.css'), 'utf8'),
])

if (letter.locale && letter.locale !== values.locale) {
	console.error(
		`Letter "${values.letter}" is written for locale "${letter.locale}" but --locale is "${values.locale}".`,
	)
	process.exit(1)
}

const accent = resolveToken(tokens, '--action-primary')?.toLowerCase()
if (accent !== '#0a6e80') {
	console.error(`Brand accent resolved to "${accent}", expected #0a6e80.`)
	process.exit(1)
}

const html = renderLetter({
	facts,
	messages,
	letter,
	locale: values.locale,
	tokensCss: tokensToCss(tokens),
	fontCss,
	printCss: `${cvCss}\n${letterCss}`,
})

const slug = letter.slug ? `-${letter.slug}` : ''
const outPath = resolve(
	process.cwd(),
	values.out ?? resolve(here, `out/Cover_Letter_Karel_Kutchan_${values.locale}${slug}.pdf`),
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
	const headline = letter.headline ?? messages.hero.role
	const issued = new Intl.DateTimeFormat(values.locale, { month: 'long', year: 'numeric' }).format(
		new Date(letter.date),
	)
	const footer = `<div style="width:100%;padding:0 13mm;font-family:Inter,sans-serif;font-size:7pt;line-height:9pt;color:${resolveToken(tokens, '--text-secondary')};display:flex;justify-content:space-between;">
		<span>${facts.curriculumVitae.person.name} — ${headline}</span>
		<span>${issued}</span>
	</div>`

	await page.pdf({
		path: outPath,
		format: 'A4',
		printBackground: true,
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
console.log(`letter  ${letter.slug ?? '—'}`)
console.log(`accent  ${accent}`)

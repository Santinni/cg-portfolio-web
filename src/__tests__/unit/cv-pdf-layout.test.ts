// @vitest-environment node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { loadFacts, loadMessages } from '../../../tools/cv-pdf/data.mjs'
import { renderCv } from '../../../tools/cv-pdf/render.mjs'
import { loadLightTokens, tokensToCss } from '../../../tools/cv-pdf/tokens.mjs'

const toolDir = resolve(process.cwd(), 'tools/cv-pdf')

async function renderDocument(locale: string) {
	const [facts, messages, tokens, printCss] = await Promise.all([
		loadFacts(),
		loadMessages(locale),
		loadLightTokens(),
		readFile(resolve(toolDir, 'cv-print.css'), 'utf8'),
	])

	return renderCv({
		facts,
		messages,
		variant: null,
		locale,
		tokensCss: tokensToCss(tokens),
		// Fonts and QR are excluded: base64 blobs would dominate the snapshot
		// without saying anything about layout.
		fontCss: '/* fonts omitted in snapshot */',
		printCss,
		qrSvg: '<!-- qr omitted in snapshot -->',
	})
}

/**
 * The approved look is the 2026 React CV. Colour binding is covered by
 * cv-pdf-tokens.test.ts; this file guards the *layout*, which previously had
 * nothing holding it in place — the stylesheet could be rewritten wholesale and
 * every test would still pass.
 */
describe('cv pdf layout contract', () => {
	it('keeps the masthead centred with the name in caps', async () => {
		const css = await readFile(resolve(toolDir, 'cv-print.css'), 'utf8')

		expect(css).toMatch(/\.header\s*\{[^}]*text-align:\s*center/)
		expect(css).toMatch(/\.name\s*\{[^}]*text-transform:\s*uppercase/)
		expect(css).toMatch(/\.name\s*\{[^}]*color:\s*var\(--action-primary\)/)
	})

	it('keeps the tinted label column in core skills', async () => {
		const css = await readFile(resolve(toolDir, 'cv-print.css'), 'utf8')

		// The band behind the labels is what makes this read as a table
		// without rules, as in the approved document.
		expect(css).toMatch(/\.skills dt\s*\{[^}]*background:\s*var\(--surface-subtle\)/)
		expect(css).toMatch(/\.skills\s*\{[^}]*grid-template-columns/)
	})

	it('constrains the QR code so it cannot overflow the masthead', async () => {
		const css = await readFile(resolve(toolDir, 'cv-print.css'), 'utf8')

		// The generated SVG carries its own width/height in millimetres. Without
		// an explicit override it ignores its box and paints over the section
		// below — which it did.
		expect(css).toMatch(/\.qr svg\s*\{[^}]*inline-size:\s*100%/)
		expect(css).toMatch(/\.qr svg\s*\{[^}]*block-size:\s*100%/)
	})

	it('prints A4 with the page geometry in @page', async () => {
		const css = await readFile(resolve(toolDir, 'cv-print.css'), 'utf8')

		expect(css).toMatch(/@page\s*\{[^}]*size:\s*A4/)
		expect(css).toMatch(/@page\s*\{[^}]*margin:/)
	})

	it('never splits a role from its bullets', async () => {
		const css = await readFile(resolve(toolDir, 'cv-print.css'), 'utf8')

		expect(css).toMatch(/\.entry\s*\{[^}]*break-inside:\s*avoid/)
	})

	it('renders every role with company, period and stack', async () => {
		const html = await renderDocument('en')

		// Role | Company | Period on one line, then the stack row.
		expect(html).toContain('class="entryHead"')
		expect(html).toContain('class="entryCompany"')
		expect(html).toContain('class="entryPeriod"')

		const stackRows = html.match(/class="entryStack"/g) ?? []
		const entries = html.match(/class="entry"/g) ?? []
		expect(entries.length).toBeGreaterThanOrEqual(10)
		expect(stackRows.length).toBe(entries.length)
	})

	it('leads with the professional summary, not a one-line intro', async () => {
		const html = await renderDocument('en')
		const summaries = html.match(/class="summary"/g) ?? []

		// Multi-paragraph, as in the approved document — the single-sentence
		// hero intro is not a professional summary.
		expect(summaries.length).toBeGreaterThanOrEqual(2)
		expect(html).toContain('42 Prague')
		expect(html).toContain('codeguy.cz')
	})

	it('matches the approved document structure', async () => {
		const html = await renderDocument('en')

		// Structure only: tags and class names, with text content dropped so
		// ordinary copy edits do not churn the snapshot.
		const skeleton = html
			.replace(/<style>[\s\S]*?<\/style>/g, '<style/>')
			.replace(/>[^<]+</g, '><')
			.replace(/\s+/g, ' ')
			.trim()

		await expect(skeleton).toMatchFileSnapshot('./__snapshots__/cv-pdf-structure.txt')
	})
})

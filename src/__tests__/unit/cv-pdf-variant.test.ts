// @vitest-environment node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { loadFacts, loadMessages, validateVariant } from '../../../tools/cv-pdf/data.mjs'
import { formatLetterDate, renderLetter, validateLetter } from '../../../tools/cv-pdf/letter.mjs'
import { renderCv, resolveEntryBody, resolveSkills } from '../../../tools/cv-pdf/render.mjs'
import { loadLightTokens, tokensToCss } from '../../../tools/cv-pdf/tokens.mjs'

const toolDir = resolve(process.cwd(), 'tools/cv-pdf')

async function renderWith(variant: Record<string, unknown> | null, locale = 'en') {
	const [facts, messages, tokens, printCss] = await Promise.all([
		loadFacts(),
		loadMessages(locale),
		loadLightTokens(),
		readFile(resolve(toolDir, 'cv-print.css'), 'utf8'),
	])
	return renderCv({
		facts,
		messages,
		variant,
		locale,
		tokensCss: tokensToCss(tokens),
		fontCss: '',
		printCss,
		qrSvg: '',
	})
}

/**
 * A variant is an overlay, never a copy. It may rewrite prose and change
 * emphasis; the facts (titles, companies, periods, stack, education) always
 * come from curriculum-vitae.ts. These tests hold that line.
 */
describe('cv pdf variant contract', () => {
	it('refuses a variant that restates hard facts', () => {
		expect(() => validateVariant({ experience: [] })).toThrow(/hard facts/)
		expect(() => validateVariant({ person: { name: 'X' } })).toThrow(/hard facts/)
		expect(() => validateVariant({ education: [] })).toThrow(/hard facts/)
	})

	it('refuses unknown keys so a typo cannot silently do nothing', () => {
		expect(() => validateVariant({ hilights: [] })).toThrow(/unknown keys: hilights/)
	})

	it('lets a role overlay rewrite prose but not the head line', () => {
		expect(() => validateVariant({ experienceCopy: { nkp: { title: 'CTO' } } })).toThrow(
			/experienceCopy\.nkp sets title/,
		)
		expect(() => validateVariant({ experienceCopy: { nkp: { stack: ['Kafka'] } } })).toThrow(
			/experienceCopy\.nkp sets stack/,
		)
		expect(() => validateVariant({ experienceCopy: { nkp: { bullets: [] } } })).toThrow(
			/non-empty array/,
		)
		expect(validateVariant({ experienceCopy: { nkp: { bullets: ['One line.'] } } })).toBeTruthy()
	})

	it('validates skills rows as catalog ids or complete new rows', () => {
		expect(() => validateVariant({ skills: [] })).toThrow(/non-empty/)
		expect(() => validateVariant({ skills: [{ title: 'Only a title' }] })).toThrow(/skills\[0\]/)
		expect(
			validateVariant({ skills: ['frontendEngineering', { title: 'A', description: 'B' }] }),
		).toBeTruthy()
	})

	it('resolves skills from the catalog, with overrides and new rows', async () => {
		const [facts, messages] = await Promise.all([loadFacts(), loadMessages('en')])
		const canonical = resolveSkills(facts.curriculumVitaeSkills, messages, null)
		expect(canonical.map((row) => row.id)).toEqual(facts.curriculumVitaeSkills.map((row) => row.id))

		const emphasised = resolveSkills(facts.curriculumVitaeSkills, messages, {
			emphasizeSkills: ['qualityAndTooling'],
		})
		expect(emphasised[0].id).toBe('qualityAndTooling')
		expect(emphasised).toHaveLength(canonical.length)

		const replaced = resolveSkills(facts.curriculumVitaeSkills, messages, {
			skills: [
				{ id: 'analysis', title: 'Analysis', description: 'Requirements' },
				{ id: 'frontendEngineering', title: 'Frontend' },
				'stateAndData',
			],
		})
		expect(replaced.map((row) => row.title)).toEqual([
			'Analysis',
			'Frontend',
			messages.skills.entries.stateAndData.title,
		])
		expect(replaced[1].description).toBe(messages.skills.entries.frontendEngineering.description)
	})

	it('uses overlay bullets verbatim and falls back to catalog prose', () => {
		const copy = { summary: 'S', descriptions: { a: 'A', b: 'B' } }
		expect(resolveEntryBody(copy, null)).toEqual(['A', 'B'])
		expect(resolveEntryBody(copy, { bullets: ['Only one'] })).toEqual(['Only one'])
		expect(resolveEntryBody({ summary: 'S', descriptions: { a: 'A' } }, null)).toEqual(['S'])
	})

	it('renders overlay prose without touching the head line or the stack', async () => {
		const html = await renderWith({
			headline: 'Technical Analyst',
			taglineKeywords: ['Requirements'],
			summary: ['First paragraph.', 'Second paragraph.'],
			highlights: [{ title: 'Fit', body: 'Evidence.' }],
			skills: [{ title: 'Analysis', description: 'Requirements and design' }],
			experienceCopy: { nkp: { bullets: ['Overlay bullet for Seeder.'] } },
			earlierExperienceCopy: { austroBohemia: { summary: 'Overlay earlier summary.' } },
			hideExperience: ['foxconn'],
		})

		expect(html).toContain('Technical Analyst')
		expect(html).toContain('Requirements')
		expect((html.match(/class="summary"/g) ?? []).length).toBe(2)
		expect(html).toContain('Overlay bullet for Seeder.')
		expect(html).toContain('Overlay earlier summary.')
		expect(html).toContain('Analysis')
		expect(html).not.toContain('Foxconn DRC')
		// Facts survive the overlay.
		expect(html).toContain('Národní knihovna ČR')
		expect(html).toContain('02/2026')
		expect(html).toContain('PostgreSQL')
		expect(html).toContain('42 Prague')
	})

	it('escapes variant prose', async () => {
		const html = await renderWith({ headline: 'A <b>bold</b> & claim' })
		expect(html).toContain('A &lt;b&gt;bold&lt;/b&gt; &amp; claim')
		expect(html).not.toContain('<b>bold</b>')
	})
})

describe('cover letter contract', () => {
	const letter = {
		slug: 'acme',
		locale: 'en',
		date: '2026-11-06',
		recipient: ['Acme', 'Hiring team'],
		subject: 'Application',
		salutation: 'Dear team,',
		paragraphs: ['First.', 'Second.'],
		closing: 'Kind regards,',
	}

	it('validates the letter shape', () => {
		expect(validateLetter(letter)).toBeTruthy()
		expect(() => validateLetter({ ...letter, date: '6.11.2026' })).toThrow(/YYYY-MM-DD/)
		expect(() => validateLetter({ ...letter, paragraphs: [] })).toThrow(/paragraphs/)
		expect(() => validateLetter({ ...letter, body: 'x' })).toThrow(/unknown keys: body/)
	})

	it('formats the date per locale', () => {
		expect(formatLetterDate('2026-11-06', 'cs')).toBe('6. listopadu 2026')
		expect(formatLetterDate('2026-11-06', 'en')).toBe('November 6, 2026')
	})

	it('prints the shared identity layer with the letter body', async () => {
		const [facts, messages, tokens, printCss] = await Promise.all([
			loadFacts(),
			loadMessages('en'),
			loadLightTokens(),
			readFile(resolve(toolDir, 'cv-print.css'), 'utf8'),
		])
		const html = renderLetter({
			facts,
			messages,
			letter,
			locale: 'en',
			tokensCss: tokensToCss(tokens),
			fontCss: '',
			printCss,
		})
		expect(html).toContain(facts.curriculumVitae.person.name)
		expect(html).toContain(facts.curriculumVitae.contact.phone)
		expect(html).toContain('class="letterRecipient"')
		expect(html).toContain('First.')
		expect(html).toContain('Kind regards,')
	})

	it('keeps the letter stylesheet token-only', async () => {
		const css = await readFile(resolve(toolDir, 'letter-print.css'), 'utf8')
		const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
		expect(withoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i)
		expect(withoutComments).not.toMatch(/\b(rgb|hsl)a?\(/i)
		const tokens = await loadLightTokens()
		for (const match of css.matchAll(/var\((--space-\d+)\)/g)) {
			expect(tokens.has(match[1]), `${match[1]} is not defined in variables.css`).toBe(true)
		}
	})
})

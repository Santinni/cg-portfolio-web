import { describe, expect, it } from 'vitest'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'
import { contact } from '@/content/site'
import { curriculumVitae } from '@/content/curriculum-vitae'
import { createLocalizedMetadata } from '@/i18n/metadata'

const selectedExperienceIds = [
	'nkp',
	'blueghost',
	'kontentAi',
	'tldrit',
	'eman',
	'lmc',
	'ampX',
	'skype',
	'foxconn',
	'mountfield',
	'bitware',
] as const

const highlightIds = ['experience', 'currentRole', 'productSystems', 'location'] as const

const coreSkillIds = [
	'frontendEngineering',
	'stateAndData',
	'validationAndForms',
	'cssUiSystems',
	'cmsPlatformIntegration',
	'qualityAndTooling',
	'accessibilityI18n',
] as const

function expectUniqueIds(entries: readonly { id: string }[]) {
	const ids = entries.map(({ id }) => id)
	expect(new Set(ids).size).toBe(ids.length)
}

function collectObjectKeys(value: unknown): string[] {
	if (!value || typeof value !== 'object') return []

	return Object.entries(value).flatMap(([key, nestedValue]) => [
		key,
		...collectObjectKeys(nestedValue),
	])
}

describe('curriculum vitae localization', () => {
	it('freezes unique stable IDs for the approved CV sections', () => {
		expectUniqueIds(curriculumVitae.experience)
		expectUniqueIds(curriculumVitae.highlights)
		expectUniqueIds(curriculumVitae.skills)
		expectUniqueIds(curriculumVitae.projects)
		expectUniqueIds(curriculumVitae.education)
		expectUniqueIds(curriculumVitae.languages)

		expect(curriculumVitae.experience.map(({ id }) => id)).toEqual(selectedExperienceIds)
		expect(curriculumVitae.highlights.map(({ id }) => id)).toEqual(highlightIds)
		expect(curriculumVitae.skills.map(({ id }) => id)).toEqual(coreSkillIds)
		expect(Object.keys(enMessages.curriculumVitae.highlights.entries)).toEqual(highlightIds)
		expect(Object.keys(csMessages.curriculumVitae.highlights.entries)).toEqual(highlightIds)
		// Every experience entry has its copy in both catalogs, in the same order (2026-09-13,
		// after the `nkp` entry was added; a missing key would only fail at render time).
		expect(Object.keys(enMessages.curriculumVitae.experience.entries)).toEqual(
			selectedExperienceIds,
		)
		expect(Object.keys(csMessages.curriculumVitae.experience.entries)).toEqual(
			selectedExperienceIds,
		)
		expect(Object.keys(enMessages.curriculumVitae.skills.entries)).toEqual(coreSkillIds)
		expect(Object.keys(csMessages.curriculumVitae.skills.entries)).toEqual(coreSkillIds)
	})

	it('keeps every experience period as YYYY-MM, end after start, newest first', () => {
		const month = /^\d{4}-(0[1-9]|1[0-2])$/
		for (const { start, end } of curriculumVitae.experience) {
			expect(start).toMatch(month)
			if (end) {
				expect(end).toMatch(month)
				expect(end >= start).toBe(true)
			}
		}
		const starts = curriculumVitae.experience.map(({ start }) => start)
		expect([...starts].sort().reverse()).toEqual(starts)
	})

	it('freezes the current role, selected chronology and public positioning', () => {
		expect(curriculumVitae.positioning).toEqual({
			roleId: 'seniorFrontendEngineer',
			minimumYearsInWeb: 10,
			experienceQualifier: 'moreThan',
		})
		expect(curriculumVitae.currentExperienceId).toBe('blueghost')
		expect(curriculumVitae.experience[0]).toMatchObject({
			id: 'nkp',
			company: 'Národní knihovna ČR',
			roleId: 'softwareEngineer',
			start: '2026-02',
			end: null,
			engagement: 'contract',
		})
		expect(curriculumVitae.experience[1]).toMatchObject({
			id: 'blueghost',
			company: 'BlueGhost',
			roleId: 'leadFrontendEngineer',
			start: '2025-03',
			end: null,
		})
		expect(curriculumVitae.experience[2]).toMatchObject({
			id: 'kontentAi',
			company: 'Kontent.ai',
			roleId: 'frontendEngineer',
			start: '2024-06',
			end: '2025-02',
			engagement: 'contract',
		})
		expect(enMessages.curriculumVitae.hero.intro).toContain('more than ten years')
		expect(csMessages.curriculumVitae.hero.intro).toContain('více než deseti lety')
	})

	it('maps each locale to the correct stable PDF language and profile', () => {
		expect(curriculumVitae.pdfByLocale).toEqual({
			en: {
				href: '/curriculum-vitae/CV_Karel_Kutchan.pdf',
				language: 'en',
				profile: 'react',
			},
			cs: {
				href: '/curriculum-vitae/CV_Karel_Kutchan_CS.pdf',
				language: 'cs',
				profile: 'general',
			},
		})
	})

	it('describes the download by role and purpose, never by file format or profile variant', () => {
		// 2026-09-12 (COD-92): the "React profile" eyebrow and the "... in PDF format"
		// description were withdrawn. The eyebrow names the language and the role, the
		// description says what the reader takes away and for whom; the locale-first
		// behaviour and the distinct profile versions stay recorded in CV-03, not in the UI.
		expect(enMessages.curriculumVitae.download.languageLabel).toBe('English')
		expect(csMessages.curriculumVitae.download.languageLabel).toBe('Čeština')
		for (const messages of [enMessages, csMessages]) {
			const download = messages.curriculumVitae.download as Record<string, string>
			expect(download.roleLabel).toBe('Senior Frontend Engineer')
			for (const value of Object.values(download)) {
				expect(value).not.toMatch(/PDF|React|profil|profile|obecn/i)
			}
		}
	})

	it('names the person, not the language or format, in the download accessible name', () => {
		// CV-03: language and profile belong to the copy that *describes* the download,
		// not to the control that performs it.
		for (const messages of [enMessages, csMessages]) {
			const { accessibilityLabel } = messages.curriculumVitae.download
			expect(accessibilityLabel).toContain('Kutchan')
			expect(accessibilityLabel).not.toMatch(/PDF|English|angli|Čeština|česk|React/i)
		}
	})

	it('derives the public email and omits private identity fields', () => {
		expect(curriculumVitae.contact.email).toBe(contact.email)
		expect(curriculumVitae.contact.emailHref).toBe(`mailto:${contact.email}`)

		const modelKeys = collectObjectKeys(curriculumVitae)
		expect(modelKeys).not.toContain('birthDate')
		expect(modelKeys).not.toContain('birthPlace')
		expect(modelKeys).not.toContain('citizenship')
		expect(modelKeys).not.toContain('streetAddress')
	})

	it.each([
		{
			locale: 'en' as const,
			messages: enMessages,
			canonical: '/curriculum-vitae',
			openGraphLocale: 'en_US',
		},
		{
			locale: 'cs' as const,
			messages: csMessages,
			canonical: '/cs/curriculum-vitae',
			openGraphLocale: 'cs_CZ',
		},
	])(
		'builds localized $locale metadata for the CV route',
		({ locale, messages, canonical, openGraphLocale }) => {
			const metadata = createLocalizedMetadata({
				locale,
				pathname: '/curriculum-vitae',
				title: messages.curriculumVitae.metadata.title,
				description: messages.curriculumVitae.metadata.description,
			})
			expect(metadata.alternates?.canonical).toBe(canonical)
			expect(metadata.alternates?.languages).toEqual({
				en: '/curriculum-vitae',
				cs: '/cs/curriculum-vitae',
				'x-default': '/curriculum-vitae',
			})
			expect(metadata.openGraph).toMatchObject({
				locale: openGraphLocale,
				url: canonical,
			})
		},
	)
})

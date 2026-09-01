import { describe, expect, it } from 'vitest'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'
import { contact } from '@/content/site'
import { curriculumVitae } from '@/content/curriculum-vitae'
import { createLocalizedMetadata } from '@/i18n/metadata'

const selectedExperienceIds = [
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
		expect(Object.keys(enMessages.curriculumVitae.skills.entries)).toEqual(coreSkillIds)
		expect(Object.keys(csMessages.curriculumVitae.skills.entries)).toEqual(coreSkillIds)
	})

	it('freezes the current role, selected chronology and public positioning', () => {
		expect(curriculumVitae.positioning).toEqual({
			roleId: 'seniorFrontendEngineer',
			minimumYearsInWeb: 10,
			experienceQualifier: 'moreThan',
		})
		expect(curriculumVitae.currentExperienceId).toBe('blueghost')
		expect(curriculumVitae.experience[0]).toMatchObject({
			id: 'blueghost',
			company: 'BlueGhost',
			roleId: 'leadFrontendEngineer',
			start: '2025-03',
			end: null,
		})
		expect(curriculumVitae.experience[1]).toMatchObject({
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
		expect(enMessages.curriculumVitae.download.languageLabel).toBe('English')
		expect(enMessages.curriculumVitae.download.profileLabel).toBe('React profile')
		expect(csMessages.curriculumVitae.download.languageLabel).toBe('Čeština')
		expect(csMessages.curriculumVitae.download.profileLabel).toBe('Obecný profesní profil')
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

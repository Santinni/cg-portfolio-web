import { describe, expect, it } from 'vitest'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'
import { createLocalizedMetadata } from '@/i18n/metadata'

describe('curriculum vitae localization', () => {
	it('keeps all nine work entries in both catalogs', () => {
		const englishEntries = Object.keys(enMessages.curriculumVitae.experience.entries)
		const czechEntries = Object.keys(csMessages.curriculumVitae.experience.entries)

		expect(englishEntries).toHaveLength(9)
		expect(czechEntries).toEqual(englishEntries)
	})

	it('provides localized CV identity, accessibility copy and English-PDF disclosure', () => {
		expect(enMessages.curriculumVitae.metadata.title).toBe('Curriculum Vitae')
		expect(csMessages.curriculumVitae.metadata.title).toBe('Životopis')
		expect(csMessages.curriculumVitae.biography.title).toBe('Kdo jsem?')
		expect(csMessages.curriculumVitae.downloadPdf).toContain('v angličtině')
		expect(csMessages.curriculumVitae.contact.location).toBe('Praha, Česká republika')
	})

	it('builds Czech canonical and language alternates for the translated CV', () => {
		const metadata = createLocalizedMetadata({
			locale: 'cs',
			pathname: '/curriculum-vitae',
			title: csMessages.curriculumVitae.metadata.title,
			description: csMessages.curriculumVitae.metadata.description,
		})

		expect(metadata.alternates?.canonical).toBe('/cs/curriculum-vitae')
		expect(metadata.alternates?.languages).toEqual({
			en: '/curriculum-vitae',
			cs: '/cs/curriculum-vitae',
			'x-default': '/curriculum-vitae',
		})
		expect(metadata.openGraph).toMatchObject({ locale: 'cs_CZ', url: '/cs/curriculum-vitae' })
	})
})

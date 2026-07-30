import { describe, expect, it } from 'vitest'

import { createLocalizedMetadata } from '@/i18n/metadata'

describe('localized metadata', () => {
	it('keeps English canonical URLs unprefixed', () => {
		const metadata = createLocalizedMetadata({
			locale: 'en',
			pathname: '/work',
			title: 'Work',
			description: 'Selected work.',
		})

		expect(metadata.alternates).toEqual({
			canonical: '/work',
			languages: { en: '/work', cs: '/cs/work', 'x-default': '/work' },
		})
		expect(metadata.openGraph).toMatchObject({ locale: 'en_US', url: '/work' })
	})

	it('prefixes Czech canonical URLs and keeps English as x-default', () => {
		const metadata = createLocalizedMetadata({
			locale: 'cs',
			pathname: '/work/energy-customer-portal',
			title: 'Případová studie',
			description: 'Vybraná práce.',
			openGraphType: 'article',
		})

		expect(metadata.alternates).toEqual({
			canonical: '/cs/work/energy-customer-portal',
			languages: {
				en: '/work/energy-customer-portal',
				cs: '/cs/work/energy-customer-portal',
				'x-default': '/work/energy-customer-portal',
			},
		})
		expect(metadata.openGraph).toMatchObject({
			type: 'article',
			locale: 'cs_CZ',
			url: '/cs/work/energy-customer-portal',
		})
	})

	it('uses /cs for the Czech homepage without a trailing slash', () => {
		const metadata = createLocalizedMetadata({
			locale: 'cs',
			pathname: '/',
			title: 'Karel Kutchan',
			description: 'Senior frontend vývojář.',
		})

		expect(metadata.alternates?.canonical).toBe('/cs')
	})
})

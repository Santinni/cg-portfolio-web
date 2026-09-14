import { describe, expect, it } from 'vitest'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'
import { APPROVED_HOME_HERO } from '../e2e/support/approved-copy'

const catalogs = { cs: csMessages, en: enMessages } as const

describe('approved Home copy', () => {
	// The e2e specs assert the approved sentences verbatim (see the fixture's header). This
	// test keeps the fixture and the catalogs identical, so a copy change that forgot one side
	// fails here in Vitest rather than in the pinned Playwright container.
	for (const locale of ['en', 'cs'] as const) {
		it(`matches the ${locale} catalog`, () => {
			const hero = catalogs[locale].home.hero
			expect({
				availability: hero.availability,
				headline: hero.headline,
				paragraphs: hero.paragraphs,
				paragraphsCompact: hero.paragraphsCompact,
				primaryCta: hero.primaryCta,
				secondaryCta: hero.secondaryCta,
			}).toEqual(APPROVED_HOME_HERO[locale])
		})

		it(`keeps the ${locale} availability line identical on the contact page (HP-03)`, () => {
			expect(catalogs[locale].contact.hero.availability).toBe(
				APPROVED_HOME_HERO[locale].availability,
			)
		})
	}
})

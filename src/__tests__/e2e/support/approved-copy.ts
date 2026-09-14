/**
 * Approved copy that the Home specs assert verbatim.
 *
 * These sentences are decisions, not implementation details: the brand headline
 * (`docs/brand/brand-decision-log.md`), the hero paragraphs, the two actions (HP-02) and
 * the availability line (HP-03) in `docs/decisions/homepage.md`. The specs pin them on
 * purpose. Reading them back from `messages/*.json` would only prove that the page renders
 * whatever the catalog holds; pinning them here means a catalog edit that changes approved
 * copy fails a test until the decision record moves with it. The parity specs also depend on
 * the exact strings: their line counts and section heights hold for these sentences only.
 *
 * Change a sentence here together with the catalog and the decision record.
 * `src/__tests__/unit/approved-copy.test.ts` compares this file with both catalogs in
 * Vitest, so drift is caught in seconds instead of in the pinned container.
 */
export const APPROVED_HOME_HERO = {
	en: {
		headline: 'I build frontend systems for products that have to last.',
		paragraphs: {
			experience:
				'More than ten years in web development, currently in a lead frontend role. I work with React, TypeScript and Next.js across customer portals, internal enterprise applications and the component libraries underneath them.',
			quality:
				'Architecture, accessibility and long-term maintainability are part of the delivery, not follow-up work.',
		},
		paragraphsCompact: {
			experience:
				'More than ten years in web development, currently in a lead frontend role. I work with React, TypeScript and Next.js across customer portals, enterprise applications and component systems.',
			quality: 'Architecture, accessibility and maintainability are part of the delivery.',
		},
		primaryCta: 'Read flagship case',
		secondaryCta: 'Book an intro call',
		availability:
			'Open to senior and lead frontend roles in Prague or remote (EU), employee or contract.',
	},
	cs: {
		headline: 'Stavím frontendové systémy pro produkty, které musí vydržet.',
		paragraphs: {
			experience:
				'Webům se věnuji přes deset let a dnes působím jako vedoucí frontend vývoje. S Reactem, TypeScriptem a Next.js pracuji na zákaznických portálech, interních podnikových aplikacích i komponentových knihovnách, na kterých stojí.',
			quality:
				'Architektura, přístupnost a dlouhodobá udržitelnost jsou součástí dodávky, ne práce odložená na později.',
		},
		paragraphsCompact: {
			experience:
				'Webům se věnuji přes deset let a nyní působím ve vedoucí frontendové roli. S Reactem, TypeScriptem a Next.js pracuji na zákaznických portálech, podnikových aplikacích a komponentových systémech.',
			quality: 'Architektura, přístupnost a udržovatelnost jsou součástí dodávky.',
		},
		primaryCta: 'Přečíst hlavní případovou studii',
		secondaryCta: 'Domluvit úvodní hovor',
		availability:
			'Otevřený seniorním a lead frontend rolím v Praze nebo remote (EU), zaměstnanecky i na kontrakt.',
	},
} as const

export type ApprovedLocale = keyof typeof APPROVED_HOME_HERO

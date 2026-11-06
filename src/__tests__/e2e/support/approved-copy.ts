/**
 * Approved copy that the Home specs assert verbatim.
 *
 * These sentences are decisions, not implementation details: the positioning and the brand
 * headline (BD-29 in `docs/brand/brand-decision-log.md`), the hero paragraphs, the two
 * actions (HP-02) and the availability line (HP-03, amended 2026-11-06) in
 * `docs/decisions/homepage.md`. The specs pin them on purpose. Reading them back from
 * `messages/*.json` would only prove that the page renders whatever the catalog holds;
 * pinning them here means a catalog edit that changes approved copy fails a test until the
 * decision record moves with it. The parity specs also depend on the exact strings: their
 * line counts and section heights hold for these sentences only.
 *
 * Change a sentence here together with the catalog and the decision record.
 * `src/__tests__/unit/approved-copy.test.ts` compares this file with both catalogs in
 * Vitest, so drift is caught in seconds instead of in the pinned container.
 */
export const APPROVED_HOME_HERO = {
	en: {
		headline: 'I build software systems for products that have to last.',
		paragraphs: {
			experience:
				'More than ten years in web development, in recent years owning frontend architecture and leading a team. I work with React, TypeScript and Next.js, design data models and APIs, and take solutions from analysis with the client through to production.',
			quality:
				'Architecture, accessibility, maintainability and working with AI are part of the delivery, not follow-up work.',
		},
		paragraphsCompact: {
			experience:
				'More than ten years in web development, lately owning frontend architecture and leading a team. React, TypeScript and Next.js, data models and APIs, from analysis to production.',
			quality: 'Architecture, accessibility, maintainability and AI are part of the delivery.',
		},
		primaryCta: 'Read flagship case',
		secondaryCta: 'Book an intro call',
		availability:
			'Open to senior and lead engineering roles in Prague or remote (EU), employee or contract.',
	},
	cs: {
		headline: 'Stavím softwarové systémy pro produkty, které musí vydržet.',
		paragraphs: {
			experience:
				'Webům se věnuji přes deset let, poslední roky s odpovědností za frontendovou architekturu a vedení týmu. Pracuji s Reactem, TypeScriptem a Next.js, navrhuji datové modely i API a řešení dotahuji od analýzy se zadavatelem po nasazení.',
			quality:
				'Architektura, přístupnost, udržitelnost a práce s AI jsou součástí dodávky, ne práce odložená na později.',
		},
		paragraphsCompact: {
			experience:
				'Webům se věnuji přes deset let, poslední roky s odpovědností za frontendovou architekturu a vedení týmu. React, TypeScript a Next.js, datové modely i API, od analýzy po nasazení.',
			quality: 'Architektura, přístupnost, udržitelnost a práce s AI jsou součástí dodávky.',
		},
		primaryCta: 'Přečíst hlavní případovou studii',
		secondaryCta: 'Domluvit úvodní hovor',
		availability:
			'Otevřený seniorním a lead inženýrským rolím v Praze nebo remote (EU), zaměstnanecky i na kontrakt.',
	},
} as const

export type ApprovedLocale = keyof typeof APPROVED_HOME_HERO

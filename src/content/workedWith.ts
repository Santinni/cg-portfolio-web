/**
 * Companies shown in the Home "Worked with" row (HP-04). Company names are brand names and
 * therefore locale-neutral, so they live here rather than in the message catalogs and are
 * used verbatim as the accessible name of each mark.
 */
export interface WorkedWithCompany {
	key: string
	name: string
	/**
	 * Public path of the mark. Every file is a single-colour silhouette on a transparent ground.
	 * `skype.svg` is the simple-icons 12 glyph (CC0), kept because the brand was retired in 2025
	 * and later icon sets dropped it.
	 */
	src: string
	/** Intrinsic `viewBox` size; only the ratio is used, the rendered height comes from tokens. */
	width: number
	height: number
}

export const workedWith = [
	{ key: 'eon', name: 'E.ON', src: '/eon.svg', width: 240, height: 73.846 },
	{ key: 'mnd', name: 'MND', src: '/mnd.svg', width: 181, height: 87 },
	{ key: 'kontent', name: 'Kontent.ai', src: '/kontent.svg', width: 555, height: 66 },
	{ key: 'skype', name: 'Skype', src: '/skype.svg', width: 24, height: 24 },
	{ key: 'jobs', name: 'Jobs.cz', src: '/jobs.svg', width: 75.834, height: 30.076 },
	{ key: 'eman', name: 'eMan', src: '/eman.svg', width: 78, height: 72.009 },
] as const satisfies readonly WorkedWithCompany[]

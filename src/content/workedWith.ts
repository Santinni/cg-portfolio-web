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
	 * and later icon sets dropped it. `nkp.svg` is the library's own wordmark from nkp.cz
	 * (svgo-optimised), first in the row as the current client. `mnd.svg` has its viewBox
	 * cropped to the ink (the source canvas was half empty), so its box is the visible mark.
	 */
	src: string
	/** Intrinsic `viewBox` size; only the ratio is used, the rendered height comes from tokens. */
	width: number
	height: number
	/**
	 * Optical size correction (HP-04, 2026-09-23): the rendered height is the tier's base mark
	 * height times this factor, so wide wordmarks and compact symbols carry a similar amount of
	 * ink. Derived from each mark's ink area against the median mark (exponent 0.35, clamped to
	 * 0.72–1.35); re-derive when a mark is added or its file changes.
	 */
	scale: number
}

export const workedWith = [
	{ key: 'nkp', name: 'Národní knihovna ČR', src: '/nkp.svg', width: 204, height: 40, scale: 0.84 },
	{ key: 'eon', name: 'E.ON', src: '/eon.svg', width: 240, height: 73.846, scale: 0.9 },
	{ key: 'mnd', name: 'MND', src: '/mnd.svg', width: 152.6, height: 44.1, scale: 0.81 },
	{ key: 'kontent', name: 'Kontent.ai', src: '/kontent.svg', width: 555, height: 66, scale: 0.72 },
	{ key: 'skype', name: 'Skype', src: '/skype.svg', width: 24, height: 24, scale: 1.2 },
	{ key: 'jobs', name: 'Jobs.cz', src: '/jobs.svg', width: 75.834, height: 30.076, scale: 1 },
	{ key: 'eman', name: 'eMan', src: '/eman.svg', width: 78, height: 72.009, scale: 1.35 },
] as const satisfies readonly WorkedWithCompany[]

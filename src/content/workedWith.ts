import type { ComponentType, SVGProps } from 'react'

import {
	EmanLogoSvg,
	EonLogoSvg,
	JobsLogoSvg,
	KontentLogoSvg,
	MndLogoSvg,
	NkpLogoSvg,
	SkypeLogoSvg,
} from '@/components/logos'

/**
 * Companies shown in the Home "Worked with" row (HP-04). Company names are brand names and
 * therefore locale-neutral, so they live here rather than in the message catalogs and are
 * used verbatim as the accessible name of each mark.
 */
export interface WorkedWithCompany {
	key: string
	name: string
	/**
	 * Mark component generated from `src/assets/logos/<key>.svg` (`pnpm icons:generate`). Every
	 * mark is a single-colour silhouette painted in `currentColor`; its viewBox carries the
	 * aspect ratio. `skype.svg` is the simple-icons 12 glyph (CC0), kept because the brand was
	 * retired in 2025 and later icon sets dropped it. `nkp.svg` is the library's own wordmark
	 * from nkp.cz, first in the row as the current client. `mnd.svg` has its viewBox cropped to
	 * the ink (the source canvas was half empty), so its box is the visible mark.
	 */
	Logo: ComponentType<SVGProps<SVGSVGElement>>
	/**
	 * Optical size correction (HP-04, 2026-09-23): the rendered height is the tier's base mark
	 * height times this factor, so wide wordmarks and compact symbols carry a similar amount of
	 * ink. Derived from each mark's ink area against the median mark (exponent 0.35, clamped to
	 * 0.72–1.35); re-derive when a mark is added or its file changes.
	 */
	scale: number
}

export const workedWith = [
	{ key: 'nkp', name: 'Národní knihovna ČR', Logo: NkpLogoSvg, scale: 0.84 },
	{ key: 'eon', name: 'E.ON', Logo: EonLogoSvg, scale: 0.9 },
	{ key: 'mnd', name: 'MND', Logo: MndLogoSvg, scale: 0.81 },
	{ key: 'kontent', name: 'Kontent.ai', Logo: KontentLogoSvg, scale: 0.72 },
	{ key: 'skype', name: 'Skype', Logo: SkypeLogoSvg, scale: 1.2 },
	{ key: 'jobs', name: 'Jobs.cz', Logo: JobsLogoSvg, scale: 1 },
	{ key: 'eman', name: 'eMan', Logo: EmanLogoSvg, scale: 1.35 },
] as const satisfies readonly WorkedWithCompany[]

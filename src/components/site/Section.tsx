import type { ReactNode } from 'react'

import styles from './Section.module.css'

type SectionTone = 'page' | 'raised' | 'subtle' | 'contrast'

interface SectionProps {
	id?: string
	'aria-labelledby'?: string
	tone?: SectionTone
	desktopTone?: SectionTone
	className?: string
	children: ReactNode
}

/** Full-width section shell providing consistent vertical rhythm and theme tone. */
export function Section({
	id,
	'aria-labelledby': ariaLabelledBy,
	tone = 'page',
	desktopTone,
	className,
	children,
}: SectionProps) {
	const classes = [
		styles.section,
		styles[`tone-${tone}`],
		desktopTone ? styles[`desktop-tone-${desktopTone}`] : undefined,
		className,
	]
		.filter(Boolean)
		.join(' ')

	return (
		<section id={id} aria-labelledby={ariaLabelledBy} className={classes}>
			{children}
		</section>
	)
}

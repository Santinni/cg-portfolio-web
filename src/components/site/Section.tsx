import type { ReactNode } from 'react'

import styles from './Section.module.css'

interface SectionProps {
	id?: string
	'aria-labelledby'?: string
	tone?: 'page' | 'raised' | 'contrast'
	className?: string
	children: ReactNode
}

/** Full-width section shell providing consistent vertical rhythm and theme tone. */
export function Section({
	id,
	'aria-labelledby': ariaLabelledBy,
	tone = 'page',
	className,
	children,
}: SectionProps) {
	const classes = [styles.section, styles[`tone-${tone}`], className].filter(Boolean).join(' ')

	return (
		<section id={id} aria-labelledby={ariaLabelledBy} className={classes}>
			{children}
		</section>
	)
}

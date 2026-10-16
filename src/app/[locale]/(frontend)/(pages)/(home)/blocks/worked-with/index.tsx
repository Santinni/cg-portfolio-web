import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Section } from '@/components/site/Section'
import { workedWith } from '@/content/workedWith'

import styles from './WorkedWith.module.css'

/**
 * Worked with — seven client and employer marks directly under the hero (HP-04).
 *
 * The eyebrow-styled `h2` is both the visible label and the section's accessible name, so
 * assistive technology hears it once rather than as an eyebrow plus a hidden heading.
 *
 * The marks are inline SVG components painted in `currentColor`, so the row takes the
 * secondary text colour in both themes and follows forced-colors (high contrast) mode. Each
 * mark is wrapped in a `role="img"` span named after the company; the SVG itself stays
 * decorative (`aria-hidden`, the generated default), so the name is announced exactly once.
 */
export default async function WorkedWith() {
	const t = await getTranslations('home.workedWith')

	return (
		<Section
			id="worked-with"
			aria-labelledby="worked-with-heading"
			className={styles.section}
			tone="page"
		>
			<Container className={styles.inner}>
				<h2 id="worked-with-heading" className={styles.eyebrow}>
					{t('eyebrow')}
				</h2>
				<ul className={styles.logos}>
					{workedWith.map(({ key, name, Logo, scale }) => (
						<li key={key} className={styles.item}>
							<span
								role="img"
								aria-label={name}
								className={styles.mark}
								style={{ '--scale': scale } as CSSProperties}
							>
								<Logo className={styles.logo} />
							</span>
						</li>
					))}
				</ul>
			</Container>
		</Section>
	)
}

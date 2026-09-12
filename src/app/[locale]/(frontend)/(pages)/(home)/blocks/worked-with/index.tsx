import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Section } from '@/components/site/Section'
import { workedWith } from '@/content/workedWith'

import styles from './WorkedWith.module.css'

/**
 * Worked with — five client and employer marks directly under the hero (HP-04).
 *
 * The eyebrow-styled `h2` is both the visible label and the section's accessible name, so
 * assistive technology hears it once rather than as an eyebrow plus a hidden heading.
 *
 * The marks are painted through a CSS mask in the secondary text colour instead of an
 * `<img>`: four of the five SVGs are white silhouettes and the fifth uses `currentColor`,
 * so an image would be invisible on the light surface and black on the dark one. Masking
 * makes the file's intrinsic colour irrelevant and keeps the row monochrome in both themes.
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
					{workedWith.map((company) => (
						<li key={company.key} className={styles.item}>
							<span
								role="img"
								aria-label={company.name}
								className={styles.mark}
								style={
									{
										'--mark': `url("${company.src}")`,
										aspectRatio: `${company.width} / ${company.height}`,
									} as CSSProperties
								}
							/>
						</li>
					))}
				</ul>
			</Container>
		</Section>
	)
}

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'

import styles from './PageIntro.module.css'

interface PageIntroProps {
	eyebrow: string
	title: string
	intro: string
	/** Optional second lead paragraph, set in the same measure and tone as `intro`. */
	secondary?: string
}

/** Shared profile-route header with the responsive measure from the approved layouts. */
export function PageIntro({ eyebrow, title, intro, secondary }: PageIntroProps) {
	return (
		<header className={styles.header}>
			<Container className={styles.inner}>
				<Eyebrow>{eyebrow}</Eyebrow>
				<h1 className={styles.title}>{title}</h1>
				<p className={styles.intro}>{intro}</p>
				{secondary ? <p className={styles.intro}>{secondary}</p> : null}
			</Container>
		</header>
	)
}

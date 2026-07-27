import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'

import styles from './PageIntro.module.css'

interface PageIntroProps {
	eyebrow: string
	title: string
	intro: string
}

/** Shared profile-route header with the responsive measure from the approved layouts. */
export function PageIntro({ eyebrow, title, intro }: PageIntroProps) {
	return (
		<header className={styles.header}>
			<Container className={styles.inner}>
				<Eyebrow>{eyebrow}</Eyebrow>
				<h1 className={styles.title}>{title}</h1>
				<p className={styles.intro}>{intro}</p>
			</Container>
		</header>
	)
}

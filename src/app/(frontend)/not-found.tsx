import { ArrowLeft } from 'lucide-react'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'

import styles from './not-found.module.css'

/**
 * Custom 404 Not Found page.
 * Displayed when a user navigates to a non-existent route.
 */
export default function NotFound() {
	return (
		<section className={styles.section} aria-labelledby="not-found-heading">
			<Container className={styles.content}>
				<Eyebrow>404 / PAGE NOT FOUND</Eyebrow>
				<h1 id="not-found-heading" className={styles.title}>
					This page is not part of the system.
				</h1>
				<p className={styles.message}>The link may be outdated, or the page may have moved.</p>
				<Button renders="link" href="/" variant="primary">
					<ArrowLeft className={styles.icon} aria-hidden="true" />
					Return home
				</Button>
			</Container>
		</section>
	)
}

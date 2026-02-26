import { Button } from '@/app/(frontend)/components/primitives/button'
import styles from '@/app/(frontend)/styles/error.module.css'

/**
 * Custom 404 Not Found page.
 * Displayed when a user navigates to a non-existent route.
 */
export default function NotFound() {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<h1 className={styles.title}>404</h1>
				<h2 className={styles.subtitle}>Page not found</h2>
				<p className={styles.message}>Sorry, but the page you are looking for does not exist.</p>
				<div className={styles.actions}>
					<Button renders="link" href="/">
						Go home
					</Button>
				</div>
			</div>
		</div>
	)
}

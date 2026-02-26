import styles from '@/app/(frontend)/styles/loading.module.css'

/** Full-page loading spinner shown during route transitions. */
export default function Loading() {
	return (
		<div className={styles.container}>
			<div className={styles.spinner} />
			<p className={styles.text}>Loading...</p>
		</div>
	)
}

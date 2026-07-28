import styles from '@/app/(frontend)/styles/loading.module.css'

/** Loading spinner shown while the Curriculum Vitae page is loading. */
export default function Loading() {
	return (
		<div className={styles.container}>
			<div className={styles.spinner} />
			<p className={styles.text}>Loading...</p>
		</div>
	)
}

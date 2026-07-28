import styles from './Timeline.module.css'

interface ExperienceEntry {
	key: string
	role: string
	description: string
}

interface TimelineProps {
	entries: readonly ExperienceEntry[]
}

/** NDA-safe experience progression without publishing employer names or exact dates. */
export function Timeline({ entries }: TimelineProps) {
	return (
		<ol className={styles.timeline}>
			{entries.map((entry) => (
				<li className={styles.entry} key={entry.key}>
					<div className={styles.marker} aria-hidden="true" />
					<div className={styles.content}>
						<h3 className={styles.role}>{entry.role}</h3>
						<p className={styles.description}>{entry.description}</p>
					</div>
				</li>
			))}
		</ol>
	)
}

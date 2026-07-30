import styles from './DownloadAction.module.css'

interface DownloadActionProps {
	href: string
	label: string
	downloadFilename?: string
	className?: string
	mode?: 'compact' | 'expanded'
}

/** Native PDF download link with an accessible label and responsive expansion states. */
export function DownloadAction({
	href,
	label,
	downloadFilename,
	className,
	mode = 'compact',
}: DownloadActionProps) {
	const classes = className ? `${styles.downloadAction} ${className}` : styles.downloadAction

	return (
		<a className={classes} href={href} download={downloadFilename ?? true} data-mode={mode}>
			<svg
				className={styles.icon}
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
				focusable="false"
			>
				<path d="M12 13v8l-4-4" />
				<path d="m12 21 4-4" />
				<path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284" />
			</svg>
			<span className={styles.label}>{label}</span>
		</a>
	)
}

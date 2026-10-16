import { DownloadIconSvg } from '@/components/icons'
import styles from './DownloadAction.module.css'

interface DownloadActionProps {
	href: string
	label: string
	accessibilityLabel?: string
	downloadFilename?: string
	className?: string
	mode?: 'compact' | 'expanded'
}

/**
 * Native PDF download link with an accessible label and responsive expansion states.
 *
 * `accessibilityLabel` overrides the accessible name, so it must contain `label`
 * verbatim — WCAG 2.5.3 Label in Name. `download-action-usage.test.ts` enforces that.
 */
export function DownloadAction({
	href,
	label,
	accessibilityLabel,
	downloadFilename,
	className,
	mode = 'compact',
}: DownloadActionProps) {
	const classes = className ? `${styles.downloadAction} ${className}` : styles.downloadAction

	return (
		<a
			className={classes}
			href={href}
			download={downloadFilename ?? true}
			aria-label={accessibilityLabel}
			data-mode={mode}
		>
			<DownloadIconSvg className={styles.icon} />
			<span className={styles.label}>{label}</span>
		</a>
	)
}

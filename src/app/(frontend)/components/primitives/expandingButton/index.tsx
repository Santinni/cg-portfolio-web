import Link from 'next/link'
import { cloneElement, forwardRef, ReactElement } from 'react'
import styles from './ExpandingButton.module.css'

/** Props for the {@link ExpandingButton} component. */
interface ExpandingButtonProps {
	href: string
	download: boolean
	buttonText: string
	icon: ReactElement<{ className?: string }>
	isFloating?: boolean
}

/**
 * Animated expanding link-button with an icon that reveals text on hover.
 * Optionally rendered as a floating action button via `isFloating`.
 */
export const ExpandingButton = forwardRef<HTMLAnchorElement, ExpandingButtonProps>(
	({ href, download, buttonText, icon, isFloating }, ref) => {
		const expandingButtonContent = (
			<Link className={styles.expandingButton} href={href} download={download} ref={ref}>
				{cloneElement(icon, { className: styles.expandingButtonIcon })}
				<span className={styles.expandingButtonText}>{buttonText}</span>
			</Link>
		)

		return isFloating ? (
			<div className={styles.floatingButtonWrapper}>{expandingButtonContent}</div>
		) : (
			expandingButtonContent
		)
	},
)

ExpandingButton.displayName = 'ExpandingButton'

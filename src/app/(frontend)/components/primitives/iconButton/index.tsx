import clsx from 'clsx'
import { type ButtonHTMLAttributes, forwardRef, type ReactElement } from 'react'

import styles from './IconButton.module.css'

type IconButtonVariant = 'default' | 'quiet'
type IconButtonSize = 'small' | 'medium' | 'large'

type AccessibleName =
	| {
			'aria-label': string
			'aria-labelledby'?: never
	  }
	| {
			'aria-label'?: never
			'aria-labelledby': string
	  }

export type IconButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'aria-label' | 'aria-labelledby' | 'children'
> &
	AccessibleName & {
		children: ReactElement
		variant?: IconButtonVariant
		size?: IconButtonSize
	}

/**
 * Accessible icon-only button matching the canonical Figma Icon Button contract.
 *
 * The icon is decorative. Callers must provide the control's accessible name
 * through either `aria-label` or `aria-labelledby`.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{ children, className, size = 'medium', type = 'button', variant = 'default', ...buttonProps },
		ref,
	) => (
		<button
			{...buttonProps}
			ref={ref}
			type={type}
			className={clsx(
				styles.iconButton,
				styles[`variant-${variant}`],
				styles[`size-${size}`],
				className,
			)}
		>
			<span className={styles.icon} aria-hidden="true">
				{children}
			</span>
		</button>
	),
)

IconButton.displayName = 'IconButton'

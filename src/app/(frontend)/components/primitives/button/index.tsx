import clsx from 'clsx'
import { Loader } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	forwardRef,
	MouseEventHandler,
	ReactNode,
	Ref,
} from 'react'

import styles from './Button.module.css'

/** Shared style props for both button and link renders. */
interface BaseButtonProps {
	className?: string
	variant?: 'primary' | 'secondary' | 'transparent' | 'text'
	accent?: 'light' | 'dark'
	rounded?: boolean
	size?: 'small' | 'medium' | 'large'
	textWeight?: 'normal' | 'demi' | 'bold'
	textSize?: 'small' | 'medium' | 'large'
	fullWidth?: boolean
	children?: ReactNode
}

/** Props when the component renders as a native `<button>`. */
interface AsButtonProps extends BaseButtonProps, ButtonHTMLAttributes<HTMLButtonElement> {
	renders?: 'button'
	isLoading?: boolean
	isDisabled?: boolean
	onClick?: MouseEventHandler<HTMLButtonElement>
}

/** Props when the component renders as a Next.js `<Link>`. */
interface AsLinkProps
	extends BaseButtonProps,
		Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
		LinkProps {
	renders: 'link'
	isLoading?: never
	isDisabled?: never
	onClick?: never
}

/** Discriminated union — use `renders="link"` for anchor behaviour. */
export type ButtonOrLinkProps = AsButtonProps | AsLinkProps

/**
 * Polymorphic Button / Link component.
 *
 * Renders either a `<button>` (default) or a Next.js `<Link>` depending
 * on the `renders` prop. Supports loading state, disabled state, multiple
 * visual variants, and forwards refs to the underlying DOM element.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>Click me</Button>
 * <Button renders="link" href="/about">About</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonOrLinkProps>(
	(
		{
			renders = 'button',
			className,
			children,
			variant,
			accent,
			rounded,
			size,
			textWeight,
			fullWidth,
			textSize,
			onClick,
			isLoading,
			isDisabled,
			...rest
		},
		ref,
	) => {
		const ariaAttrs = {
			'aria-busy': isLoading ? true : undefined,
			'aria-disabled': isDisabled ? true : undefined,
			...(rest['aria-label'] ? { 'aria-label': rest['aria-label'] } : {}),
		}

		const classes = clsx(styles.button, className, {
			[styles[`variant-${variant}`]]: variant,
			[styles[`accent-${accent}`]]: accent,
			[styles[`size-${size}`]]: size,
			[styles.disabled]: isDisabled,
			[styles[`text-weight-${textWeight}`]]: textWeight,
			[styles.fullWidth]: fullWidth,
			[styles[`text-size-${textSize}`]]: textSize,
			[styles.rounded]: rounded,
			[styles.isLoading]: isLoading,
		})

		if (renders === 'link') {
			const { href, ...linkRest } = rest as Omit<AsLinkProps, 'renders'>

			return (
				<Link href={href} ref={ref as Ref<HTMLAnchorElement>} className={classes} {...linkRest}>
					<span className={styles.buttonContent}>{children}</span>
				</Link>
			)
		} else {
			const buttonProps = rest as Omit<AsButtonProps, 'renders'>

			return (
				<button
					type="button"
					className={classes}
					onClick={onClick}
					disabled={isDisabled || isLoading}
					ref={ref as React.Ref<HTMLButtonElement>}
					{...buttonProps}
					{...ariaAttrs}
				>
					{isLoading && (
						<span className={styles.loading}>
							<Loader className={styles.loadingIcon} />
						</span>
					)}
					<span className={clsx(isLoading && styles.isLoading, styles.buttonContent)}>
						{children}
					</span>
				</button>
			)
		}
	},
)

Button.displayName = 'Button'

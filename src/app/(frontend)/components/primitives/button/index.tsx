import clsx from 'clsx'
import { Loader } from 'lucide-react'
import {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	ComponentProps,
	forwardRef,
	MouseEventHandler,
	ReactNode,
	Ref,
} from 'react'

import styles from './Button.module.css'
import { Link } from '@/i18n/navigation'

/** Shared style props for both button and link renders. */
interface BaseButtonProps {
	className?: string
	variant?: 'primary' | 'secondary' | 'quiet' | 'transparent' | 'text'
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
		Omit<ComponentProps<typeof Link>, 'children' | 'className'> {
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
			variant = 'primary',
			accent,
			rounded,
			size = 'medium',
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
		const classes = clsx(
			styles.button,
			styles[`variant-${variant}`],
			styles[`size-${size}`],
			className,
			{
				[styles[`accent-${accent}`]]: accent,
				[styles[`text-weight-${textWeight}`]]: textWeight,
				[styles.fullWidth]: fullWidth,
				[styles[`text-size-${textSize}`]]: textSize,
				[styles.rounded]: rounded,
			},
		)

		if (renders === 'link') {
			const { href, ...linkRest } = rest as Omit<AsLinkProps, 'renders'>

			return (
				<Link href={href} ref={ref as Ref<HTMLAnchorElement>} className={classes} {...linkRest}>
					<span className={styles.buttonContent}>{children}</span>
				</Link>
			)
		} else {
			const {
				disabled,
				type = 'button',
				'aria-busy': ariaBusy,
				'aria-disabled': ariaDisabled,
				...buttonProps
			} = rest as Omit<AsButtonProps, 'renders'>
			const effectiveDisabled = Boolean(disabled || isDisabled || isLoading)
			const buttonClasses = clsx(classes, {
				[styles.disabled]: effectiveDisabled && !isLoading,
				[styles.loadingState]: isLoading,
			})

			return (
				<button
					{...buttonProps}
					type={type}
					className={buttonClasses}
					onClick={onClick}
					disabled={effectiveDisabled}
					ref={ref as React.Ref<HTMLButtonElement>}
					aria-busy={isLoading ? true : ariaBusy}
					aria-disabled={effectiveDisabled ? true : ariaDisabled}
					data-loading={isLoading ? true : undefined}
				>
					{isLoading && (
						<span className={styles.loading} aria-hidden="true">
							<Loader className={styles.loadingIcon} aria-hidden="true" />
						</span>
					)}
					<span className={clsx(styles.buttonContent, isLoading && styles.loadingContent)}>
						{children}
					</span>
				</button>
			)
		}
	},
)

Button.displayName = 'Button'

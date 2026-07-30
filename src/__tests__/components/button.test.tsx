import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '@/app/(frontend)/components/primitives/button'

// Keep the component test focused on Button behavior rather than next-intl routing.
vi.mock('@/i18n/navigation', () => ({
	Link: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode
		href: string
		[key: string]: unknown
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}))

describe('Button', () => {
	describe('as button (default)', () => {
		it('renders as a button element by default', () => {
			render(<Button>Click me</Button>)
			const button = screen.getByRole('button', { name: 'Click me' })

			expect(button).toBeInTheDocument()
			expect(button.tagName).toBe('BUTTON')
			expect(button).toHaveAttribute('type', 'button')
			expect(button.className).toContain('variant-primary')
			expect(button.className).toContain('size-medium')
		})

		it('calls onClick when clicked', async () => {
			const user = userEvent.setup()
			const handleClick = vi.fn()

			render(<Button onClick={handleClick}>Click me</Button>)
			await user.click(screen.getByRole('button'))

			expect(handleClick).toHaveBeenCalledOnce()
		})

		it('is disabled when isDisabled is true', () => {
			render(<Button isDisabled>Disabled</Button>)
			const button = screen.getByRole('button')

			expect(button).toBeDisabled()
			expect(button).toHaveAttribute('aria-disabled', 'true')
			expect(button.className).toContain('disabled')
		})

		it('treats the native disabled prop as the canonical disabled state', () => {
			render(<Button disabled>Disabled</Button>)
			const button = screen.getByRole('button')

			expect(button).toBeDisabled()
			expect(button).toHaveAttribute('aria-disabled', 'true')
			expect(button.className).toContain('disabled')
		})

		it('does not let disabled=false override isDisabled', () => {
			render(
				<Button isDisabled disabled={false}>
					Disabled
				</Button>,
			)

			expect(screen.getByRole('button')).toBeDisabled()
		})

		it('shows loading state with aria-busy', () => {
			render(<Button isLoading>Loading</Button>)
			const button = screen.getByRole('button')

			expect(button).toBeDisabled()
			expect(button).toHaveAttribute('aria-busy', 'true')
			expect(button).toHaveAccessibleName('Loading')
			expect(button).toHaveAttribute('data-loading', 'true')
			expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
		})

		it('does not let disabled=false override loading', () => {
			render(
				<Button isLoading disabled={false}>
					Loading
				</Button>,
			)

			expect(screen.getByRole('button')).toBeDisabled()
		})

		it('does not fire onClick when disabled', async () => {
			const user = userEvent.setup()
			const handleClick = vi.fn()

			render(
				<Button onClick={handleClick} isDisabled>
					Click me
				</Button>,
			)
			await user.click(screen.getByRole('button'))

			expect(handleClick).not.toHaveBeenCalled()
		})

		it('applies variant class', () => {
			render(<Button variant="primary">Primary</Button>)
			const button = screen.getByRole('button')

			expect(button.className).toContain('variant-primary')
		})

		it.each(['primary', 'secondary', 'quiet'] as const)(
			'applies the canonical %s variant class',
			(variant) => {
				render(<Button variant={variant}>{variant}</Button>)
				expect(screen.getByRole('button').className).toContain(`variant-${variant}`)
			},
		)

		// `transparent` is the only legacy variant left; its sole consumer is
		// `ExpandableText`. `text`, `accent`, `textSize` and `textWeight` had no
		// consumer in source or tests and were removed against Figma `21:110`,
		// which defines `Kind` as Primary / Secondary / Quiet only.
		it('preserves the transparent compatibility variant', () => {
			render(<Button variant="transparent">transparent</Button>)
			expect(screen.getByRole('button').className).toContain('variant-transparent')
		})

		it.each(['small', 'medium', 'large'] as const)('applies the %s size class', (size) => {
			render(<Button size={size}>{size}</Button>)
			const button = screen.getByRole('button')

			expect(button.className).toContain(`size-${size}`)
		})

		it('preserves an explicit submit type', () => {
			render(<Button type="submit">Submit</Button>)

			expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
		})

		it('applies fullWidth class', () => {
			render(<Button fullWidth>Full Width</Button>)
			const button = screen.getByRole('button')

			expect(button.className).toContain('fullWidth')
		})

		it('applies rounded class', () => {
			render(<Button rounded>Rounded</Button>)
			const button = screen.getByRole('button')

			expect(button.className).toContain('rounded')
		})

		it('keeps transparent and rounded compatibility classes on icon controls', () => {
			render(
				<Button variant="transparent" rounded aria-label="Open menu">
					<span aria-hidden="true">≡</span>
				</Button>,
			)
			const button = screen.getByRole('button', { name: 'Open menu' })

			expect(button.className).toContain('variant-transparent')
			expect(button.className).toContain('size-medium')
			expect(button.className).toContain('rounded')
		})

		it('forwards ref', () => {
			const ref = vi.fn()
			render(<Button ref={ref}>Ref</Button>)

			expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
		})

		it('passes aria-label through', () => {
			render(<Button aria-label="Close dialog">X</Button>)
			const button = screen.getByRole('button', { name: 'Close dialog' })

			expect(button).toBeInTheDocument()
		})
	})

	describe('as link', () => {
		it('renders as an anchor element', () => {
			render(
				<Button renders="link" href="/about">
					Go to About
				</Button>,
			)
			const link = screen.getByRole('link', { name: 'Go to About' })

			expect(link).toBeInTheDocument()
			expect(link).toHaveAttribute('href', '/about')
			expect(link.className).toContain('variant-primary')
			expect(link.className).toContain('size-medium')
		})

		it('forwards ref for link variant', () => {
			const ref = vi.fn()
			render(
				<Button renders="link" href="/test" ref={ref}>
					Link
				</Button>,
			)

			expect(ref).toHaveBeenCalledWith(expect.any(HTMLAnchorElement))
		})

		it('applies variant classes to links', () => {
			render(
				<Button renders="link" href="/test" variant="secondary">
					Styled Link
				</Button>,
			)
			const link = screen.getByRole('link')

			expect(link.className).toContain('variant-secondary')
		})
	})
})

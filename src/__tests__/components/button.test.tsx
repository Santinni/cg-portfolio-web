import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '@/app/(frontend)/components/primitives/button'

// Mock next/link
vi.mock('next/link', () => ({
	default: ({
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
		})

		it('shows loading state with aria-busy', () => {
			render(<Button isLoading>Loading</Button>)
			const button = screen.getByRole('button')

			expect(button).toBeDisabled()
			expect(button).toHaveAttribute('aria-busy', 'true')
		})

		it('does not fire onClick when disabled', async () => {
			const user = userEvent.setup()
			const handleClick = vi.fn()

			render(
				<Button onClick={handleClick} isDisabled>
					Click me
				</Button>
			)
			await user.click(screen.getByRole('button'))

			expect(handleClick).not.toHaveBeenCalled()
		})

		it('applies variant class', () => {
			render(<Button variant="primary">Primary</Button>)
			const button = screen.getByRole('button')

			expect(button.className).toContain('variant-primary')
		})

		it('applies size class', () => {
			render(<Button size="large">Large</Button>)
			const button = screen.getByRole('button')

			expect(button.className).toContain('size-large')
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
				</Button>
			)
			const link = screen.getByRole('link', { name: 'Go to About' })

			expect(link).toBeInTheDocument()
			expect(link).toHaveAttribute('href', '/about')
		})

		it('forwards ref for link variant', () => {
			const ref = vi.fn()
			render(
				<Button renders="link" href="/test" ref={ref}>
					Link
				</Button>
			)

			expect(ref).toHaveBeenCalledWith(expect.any(HTMLAnchorElement))
		})

		it('applies variant classes to links', () => {
			render(
				<Button renders="link" href="/test" variant="secondary">
					Styled Link
				</Button>
			)
			const link = screen.getByRole('link')

			expect(link.className).toContain('variant-secondary')
		})
	})
})

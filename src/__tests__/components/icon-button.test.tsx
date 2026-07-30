import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { IconButton } from '@/app/(frontend)/components/primitives/iconButton'

describe('IconButton', () => {
	it('renders a native button with canonical defaults', () => {
		render(
			<IconButton aria-label="Open menu">
				<svg />
			</IconButton>,
		)

		const button = screen.getByRole('button', { name: 'Open menu' })

		expect(button.tagName).toBe('BUTTON')
		expect(button).toHaveAttribute('type', 'button')
		expect(button.className).toContain('variant-default')
		expect(button.className).toContain('size-medium')
	})

	it.each(['default', 'quiet'] as const)('applies the %s variant class', (variant) => {
		render(
			<IconButton aria-label={`${variant} control`} variant={variant}>
				<svg />
			</IconButton>,
		)

		expect(screen.getByRole('button')).toHaveClass(`variant-${variant}`)
	})

	it.each(['small', 'medium', 'large'] as const)('applies the %s size class', (size) => {
		render(
			<IconButton aria-label={`${size} control`} size={size}>
				<svg />
			</IconButton>,
		)

		expect(screen.getByRole('button')).toHaveClass(`size-${size}`)
	})

	it('preserves an explicit submit type', () => {
		render(
			<IconButton aria-label="Submit form" type="submit">
				<svg />
			</IconButton>,
		)

		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
	})

	it('forwards its ref to the native button', () => {
		const ref = createRef<HTMLButtonElement>()

		render(
			<IconButton ref={ref} aria-label="Open menu">
				<svg />
			</IconButton>,
		)

		expect(ref.current).toBe(screen.getByRole('button'))
	})

	it('forwards interaction ARIA attributes', () => {
		render(
			<IconButton
				aria-label="Open menu"
				aria-expanded="false"
				aria-controls="site-menu"
				aria-haspopup="dialog"
			>
				<svg />
			</IconButton>,
		)

		const button = screen.getByRole('button')

		expect(button).toHaveAttribute('aria-expanded', 'false')
		expect(button).toHaveAttribute('aria-controls', 'site-menu')
		expect(button).toHaveAttribute('aria-haspopup', 'dialog')
	})

	it('supports an accessible name supplied by aria-labelledby', () => {
		render(
			<>
				<span id="menu-label">Open site menu</span>
				<IconButton aria-labelledby="menu-label">
					<svg />
				</IconButton>
			</>,
		)

		expect(screen.getByRole('button', { name: 'Open site menu' })).toBeInTheDocument()
	})

	it('hides the decorative icon wrapper from assistive technology', () => {
		const { container } = render(
			<IconButton aria-label="Open menu">
				<svg data-testid="menu-icon" />
			</IconButton>,
		)

		expect(screen.getByTestId('menu-icon').parentElement).toHaveAttribute('aria-hidden', 'true')
		expect(container.querySelector('svg')).toBeInTheDocument()
	})

	it('uses native disabled behavior', async () => {
		const user = userEvent.setup()
		const handleClick = vi.fn()

		render(
			<IconButton aria-label="Unavailable action" disabled onClick={handleClick}>
				<svg />
			</IconButton>,
		)

		const button = screen.getByRole('button')
		expect(button).toBeDisabled()

		await user.click(button)
		expect(handleClick).not.toHaveBeenCalled()
	})

	it('retains a consumer class name', () => {
		render(
			<IconButton aria-label="Open menu" className="navigation-control">
				<svg />
			</IconButton>,
		)

		expect(screen.getByRole('button')).toHaveClass('navigation-control')
	})
})

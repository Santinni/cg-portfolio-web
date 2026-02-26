import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import ExpandableText from '@/app/(frontend)/components/primitives/expandableText'

describe('ExpandableText', () => {
	it('renders children content', () => {
		render(
			<ExpandableText>
				<p>Test content</p>
			</ExpandableText>
		)

		expect(screen.getByText('Test content')).toBeInTheDocument()
	})

	it('starts in collapsed state', () => {
		render(
			<ExpandableText>
				<p>Content</p>
			</ExpandableText>
		)

		const toggle = screen.getByRole('button')
		expect(toggle).toHaveAttribute('aria-expanded', 'false')
	})

	it('has aria-hidden on content region when collapsed', () => {
		render(
			<ExpandableText>
				<p>Content</p>
			</ExpandableText>
		)

		const region = screen.getByRole('region', { hidden: true })
		expect(region).toHaveAttribute('aria-hidden', 'true')
	})

	it('expands when toggle button is clicked', async () => {
		const user = userEvent.setup()

		render(
			<ExpandableText>
				<p>Content</p>
			</ExpandableText>
		)

		const toggle = screen.getByRole('button')
		await user.click(toggle)

		expect(toggle).toHaveAttribute('aria-expanded', 'true')
	})

	it('shows content region when expanded', async () => {
		const user = userEvent.setup()

		render(
			<ExpandableText>
				<p>Content</p>
			</ExpandableText>
		)

		await user.click(screen.getByRole('button'))

		const region = screen.getByRole('region')
		expect(region).toHaveAttribute('aria-hidden', 'false')
	})

	it('collapses when toggle is clicked again', async () => {
		const user = userEvent.setup()

		render(
			<ExpandableText>
				<p>Content</p>
			</ExpandableText>
		)

		const toggle = screen.getByRole('button')
		await user.click(toggle) // expand
		await user.click(toggle) // collapse

		expect(toggle).toHaveAttribute('aria-expanded', 'false')
	})

	it('has aria-controls linking button to content', () => {
		render(
			<ExpandableText>
				<p>Content</p>
			</ExpandableText>
		)

		const toggle = screen.getByRole('button')
		const controlsId = toggle.getAttribute('aria-controls')

		expect(controlsId).toBeTruthy()

		const region = screen.getByRole('region', { hidden: true })
		expect(region.id).toBe(controlsId)
	})

	it('updates aria-label based on state', async () => {
		const user = userEvent.setup()

		render(
			<ExpandableText>
				<p>Content</p>
			</ExpandableText>
		)

		const toggle = screen.getByRole('button')
		expect(toggle).toHaveAttribute('aria-label', 'Show more')

		await user.click(toggle)
		expect(toggle).toHaveAttribute('aria-label', 'Show less')
	})
})

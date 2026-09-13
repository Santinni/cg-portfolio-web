import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { DownloadAction } from '@/app/(frontend)/components/primitives/downloadAction'

describe('DownloadAction', () => {
	it('renders an accessible native download anchor with the provided filename', async () => {
		const user = userEvent.setup()

		render(
			<DownloadAction
				href="/curriculum-vitae/CV_Karel_Kutchan.pdf"
				label="Download English CV"
				downloadFilename="Karel_Kutchan_CV_EN.pdf"
				className="custom-class"
			/>,
		)

		const link = screen.getByRole('link', { name: 'Download English CV' })
		expect(link.tagName).toBe('A')
		expect(link).toHaveAttribute('href', '/curriculum-vitae/CV_Karel_Kutchan.pdf')
		expect(link).toHaveAttribute('download', 'Karel_Kutchan_CV_EN.pdf')
		expect(link).toHaveAttribute('data-mode', 'compact')
		expect(link).toHaveClass('custom-class')
		expect(screen.getByText('Download English CV')).toBeInTheDocument()

		const icon = link.querySelector('svg')
		expect(icon).toHaveAttribute('aria-hidden', 'true')
		expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
		expect(icon).toHaveAttribute('width', '24')
		expect(icon).toHaveAttribute('height', '24')
		expect(icon).toHaveAttribute('fill', 'none')
		expect(icon).toHaveAttribute('stroke', 'currentColor')
		expect(icon).toHaveAttribute('stroke-width', '2')
		expect(icon).toHaveAttribute('stroke-linecap', 'round')
		expect(icon).toHaveAttribute('stroke-linejoin', 'round')
		expect(
			Array.from(icon?.querySelectorAll('path') ?? []).map((path) => path.getAttribute('d')),
		).toEqual([
			'M12 13v8l-4-4',
			'm12 21 4-4',
			'M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284',
		])

		await user.tab()
		expect(link).toHaveFocus()
	})

	it('keeps a Czech label accessible and enables native download without a filename override', () => {
		render(
			<DownloadAction href="/curriculum-vitae/CV_Karel_Kutchan_CS.pdf" label="Stáhnout české CV" />,
		)

		const link = screen.getByRole('link', { name: 'Stáhnout české CV' })
		expect(link).toHaveAttribute('href', '/curriculum-vitae/CV_Karel_Kutchan_CS.pdf')
		expect(link).toHaveAttribute('download', '')
		expect(screen.getByText('Stáhnout české CV')).toBeInTheDocument()
	})

	it('lets an accessible name override the visible label', () => {
		const { rerender } = render(
			<DownloadAction href="/curriculum-vitae/CV_Karel_Kutchan.pdf" label="Download CV" />,
		)

		expect(screen.getByRole('link', { name: 'Download CV' })).not.toHaveAttribute('aria-label')

		rerender(
			<DownloadAction
				href="/curriculum-vitae/CV_Karel_Kutchan.pdf"
				label="Download CV"
				accessibilityLabel="Download CV — Karel Kutchan"
			/>,
		)

		const link = screen.getByRole('link', { name: 'Download CV — Karel Kutchan' })
		expect(link).toHaveAttribute('aria-label', 'Download CV — Karel Kutchan')
		expect(screen.getByText('Download CV')).toBeInTheDocument()
	})

	it('renders the persistent expanded component mode', () => {
		render(
			<DownloadAction
				href="/curriculum-vitae/CV_Karel_Kutchan.pdf"
				label="Download CV"
				mode="expanded"
			/>,
		)

		const link = screen.getByRole('link', { name: 'Download CV' })
		expect(link).toHaveAttribute('data-mode', 'expanded')
		expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
		expect(screen.getByText('Download CV')).toBeInTheDocument()
	})
})

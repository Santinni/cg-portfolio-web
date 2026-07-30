import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { BookingScheduler } from '@/components/booking/BookingScheduler'

const schedulerProps = {
	scheduleUrl:
		'https://calendar.google.com/calendar/appointments/schedules/example-schedule?gv=true',
	emailHref: 'mailto:karel@codeguy.cz',
	privacyText:
		'Loading the calendar shares connection data with Google. You can use either fallback instead.',
	loadLabel: 'Load Google Calendar',
	loadingLabel: 'Loading Google Calendar',
	iframeTitle: 'Google Calendar appointment schedule',
	fallbackTitle: 'Other ways to arrange a call',
	externalCalendarLabel: 'Open Google Calendar in a new tab',
	emailLabel: 'Email karel@codeguy.cz',
} as const

describe('BookingScheduler', () => {
	it('defers the iframe and exposes both fallbacks before consent', () => {
		const { container } = render(<BookingScheduler {...schedulerProps} />)

		expect(container.querySelector('[data-booking-scheduler]')).toBeInTheDocument()
		expect(container.querySelector('iframe[data-booking-frame]')).not.toBeInTheDocument()

		const privacy = screen.getByText(schedulerProps.privacyText)
		const loadButton = screen.getByRole('button', { name: schedulerProps.loadLabel })
		expect(privacy).toHaveAttribute('id', 'booking-privacy-description')
		expect(loadButton).toHaveAttribute('data-booking-load')
		expect(loadButton).toHaveAttribute('aria-describedby', privacy.id)

		expect(
			screen.getByRole('link', { name: schedulerProps.externalCalendarLabel }),
		).toHaveAttribute('href', schedulerProps.scheduleUrl)
		expect(
			screen.getByRole('link', { name: schedulerProps.externalCalendarLabel }),
		).toHaveAttribute('target', '_blank')
		expect(
			screen.getByRole('link', { name: schedulerProps.externalCalendarLabel }),
		).toHaveAttribute('rel', 'noopener noreferrer')
		expect(screen.getByRole('link', { name: schedulerProps.emailLabel })).toHaveAttribute(
			'href',
			schedulerProps.emailHref,
		)
	})

	it('loads exactly one localized iframe from the keyboard and keeps both fallbacks', async () => {
		const user = userEvent.setup()
		const { container } = render(<BookingScheduler {...schedulerProps} />)
		const loadButton = screen.getByRole('button', { name: schedulerProps.loadLabel })

		await user.tab()
		expect(loadButton).toHaveFocus()
		await user.keyboard('{Enter}')

		const frames = container.querySelectorAll('iframe[data-booking-frame]')
		expect(frames).toHaveLength(1)
		expect(frames[0]).toHaveAttribute('title', schedulerProps.iframeTitle)
		expect(frames[0]).toHaveAttribute('src', schedulerProps.scheduleUrl)
		expect(frames[0]).toHaveAttribute('loading', 'lazy')
		expect(frames[0]).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
		expect(screen.getByRole('status')).toHaveTextContent(schedulerProps.loadingLabel)
		expect(screen.getByRole('link', { name: schedulerProps.externalCalendarLabel })).toBeVisible()
		expect(screen.getByRole('link', { name: schedulerProps.emailLabel })).toBeVisible()
	})

	it('does not create duplicate iframes on repeated click activation', async () => {
		const user = userEvent.setup()
		const { container } = render(<BookingScheduler {...schedulerProps} />)
		const loadButton = screen.getByRole('button', { name: schedulerProps.loadLabel })

		await user.click(loadButton)
		expect(container.querySelectorAll('iframe[data-booking-frame]')).toHaveLength(1)
		expect(screen.queryByRole('button', { name: schedulerProps.loadLabel })).not.toBeInTheDocument()
		expect(screen.getByRole('link', { name: schedulerProps.externalCalendarLabel })).toBeVisible()
		expect(screen.getByRole('link', { name: schedulerProps.emailLabel })).toBeVisible()
	})
})

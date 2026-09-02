import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ContactLink } from '@/components/site/ContactLink'
import { type ContactMethod, contactMethods } from '@/content/contact'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

const catalogs = [
	['en', enMessages],
	['cs', csMessages],
] as const

/** Resolves a catalog-labelled method exactly the way the CV and contact pages do. */
function resolveMethod(messages: (typeof catalogs)[number][1], key: ContactMethod['key']) {
	const method = contactMethods.find((entry) => entry.key === key)
	if (!method) throw new Error(`Unknown contact method: ${key}`)

	const labels = messages.contact.methods

	return {
		...method,
		label: labels[key].label,
		value: key === 'location' ? labels.location.value : method.value,
	}
}

describe('ContactLink', () => {
	it.each(catalogs)('renders the %s row variant with label and value', (_locale, messages) => {
		render(<ContactLink method={resolveMethod(messages, 'email')} />)

		const link = screen.getByRole('link')
		expect(link).toHaveAttribute('href', 'mailto:karel@codeguy.cz')
		expect(link).toHaveAttribute('data-contact-method', 'email')
		expect(link).toHaveClass('row')
		expect(screen.getByText(messages.contact.methods.email.label)).toBeInTheDocument()
		expect(screen.getByText('karel@codeguy.cz')).toBeInTheDocument()
	})

	it.each(catalogs)('never opens the %s mailto in a new tab', (_locale, messages) => {
		render(<ContactLink method={resolveMethod(messages, 'email')} variant="inline" />)

		const link = screen.getByRole('link', { name: 'karel@codeguy.cz' })
		expect(link).not.toHaveAttribute('target')
		expect(link).not.toHaveAttribute('rel')
		expect(link.querySelector('svg')).toBeNull()
	})

	it.each(catalogs)('keeps %s external profiles safe and signposted', (_locale, messages) => {
		const { rerender } = render(
			<ContactLink method={resolveMethod(messages, 'linkedin')} variant="inline" />,
		)

		const linkedin = screen.getByRole('link', { name: 'LinkedIn' })
		expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/karelkutchan/')
		expect(linkedin).toHaveAttribute('target', '_blank')
		expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
		expect(linkedin.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')

		rerender(<ContactLink method={resolveMethod(messages, 'github')} variant="row" />)

		const github = screen.getByRole('link', { name: /GitHub/ })
		expect(github).toHaveAttribute('href', 'https://github.com/Santinni')
		expect(github).toHaveAttribute('target', '_blank')
		expect(github).toHaveAttribute('rel', 'noopener noreferrer')
	})

	it.each(catalogs)('leaves the %s location non-interactive in both variants', (_l, messages) => {
		const locationValue = messages.contact.methods.location.value
		const { rerender } = render(<ContactLink method={resolveMethod(messages, 'location')} />)

		expect(screen.queryByRole('link')).toBeNull()
		expect(screen.getByText(locationValue)).toBeInTheDocument()

		rerender(<ContactLink method={resolveMethod(messages, 'location')} variant="inline" />)

		expect(screen.queryByRole('link')).toBeNull()
		const location = screen.getByText(locationValue).closest('[data-contact-method]')
		expect(location?.tagName).toBe('DIV')
		expect(location).toHaveClass('inline')
	})

	it.each(catalogs)(
		'names %s profiles by platform and direct channels by address when inline',
		(_locale, messages) => {
			const { rerender } = render(
				<ContactLink method={resolveMethod(messages, 'email')} variant="inline" />,
			)

			// The e-mail address is the thing a visitor copies; the platform name is the
			// thing a visitor recognizes. Inline space only fits one string per method.
			expect(screen.getByRole('link')).toHaveAccessibleName('karel@codeguy.cz')

			rerender(<ContactLink method={resolveMethod(messages, 'linkedin')} variant="inline" />)

			expect(screen.getByRole('link')).toHaveAccessibleName('LinkedIn')
			expect(screen.queryByText('karelkutchan')).toBeNull()
		},
	)
})

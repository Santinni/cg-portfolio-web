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
		expect(link.querySelectorAll('svg')).toHaveLength(0)
	})

	it.each(catalogs)('keeps %s external profiles safe and signposted', (_locale, messages) => {
		const { rerender } = render(
			<ContactLink method={resolveMethod(messages, 'linkedin')} variant="inline" />,
		)

		const linkedin = screen.getByRole('link', { name: 'LinkedIn' })
		expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/karelkutchan/')
		expect(linkedin).toHaveAttribute('target', '_blank')
		expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
		// Inline external profiles are the brand mark alone -- no arrow -- at every width.
		const inlineSvgs = linkedin.querySelectorAll('svg')
		expect(inlineSvgs).toHaveLength(1)
		expect(inlineSvgs[0]).toHaveAttribute('data-contact-glyph', 'brand')
		for (const svg of inlineSvgs) expect(svg).toHaveAttribute('aria-hidden', 'true')

		// GitHub inline, not only LinkedIn: a swapped ternary in BrandGlyph or a dropped key in
		// hasBrandGlyph would leave every other assertion in this file green.
		rerender(<ContactLink method={resolveMethod(messages, 'github')} variant="inline" />)

		const githubInline = screen.getByRole('link', { name: 'GitHub' })
		expect(githubInline).toHaveAttribute('href', 'https://github.com/Santinni')
		expect(githubInline).toHaveClass('inline', 'inlineIconic')
		const githubSvgs = githubInline.querySelectorAll('svg')
		expect(githubSvgs).toHaveLength(1)
		expect(githubSvgs[0]).toHaveAttribute('data-contact-glyph', 'brand')

		rerender(<ContactLink method={resolveMethod(messages, 'github')} variant="row" />)

		const github = screen.getByRole('link', { name: /GitHub/ })
		expect(github).toHaveAttribute('href', 'https://github.com/Santinni')
		expect(github).toHaveAttribute('target', '_blank')
		expect(github).toHaveAttribute('rel', 'noopener noreferrer')
		// The row variant keeps its arrow -- the icon-only rule is scoped to `inline`. Counting
		// to one is not enough: swapping the arrow for a brand mark here would keep the count
		// at 1 and ship green, so identify the glyph rather than tally it.
		expect(github.querySelectorAll('svg')).toHaveLength(1)
		expect(github.querySelector('svg')).not.toHaveAttribute('data-contact-glyph')
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

	/**
	 * Scope note: this project's Vitest config sets no `css.include`, so CSS Modules are not
	 * processed here, and `css.modules.classNameStrategy: 'non-scoped'` (vitest.config.ts:20-24)
	 * is what makes `styles.inlineIconic` echo the bare key back -- under Vitest's default
	 * `stable` strategy the class would be `_inlineIconic_<hash>` and these assertions would
	 * fail. They therefore prove which branch the component took, not that the class exists in
	 * the stylesheet. The rendered result is proven by
	 * `src/__tests__/e2e/curriculum-vitae.spec.ts` and the pinned pixel suite.
	 */
	it.each(catalogs)(
		'pins the %s inline density branch and external profile name',
		(_locale, messages) => {
			const { rerender } = render(
				<ContactLink method={resolveMethod(messages, 'email')} variant="inline" />,
			)

			const email = screen.getByRole('link', { name: 'karel@codeguy.cz' })
			expect(email).toHaveClass('inline')
			expect(email).not.toHaveClass('inlineIconic')

			for (const [key, label] of [
				['linkedin', 'LinkedIn'],
				['github', 'GitHub'],
			] as const) {
				rerender(<ContactLink method={resolveMethod(messages, key)} variant="inline" />)

				const profile = screen.getByRole('link', { name: label })
				expect(profile, key).toHaveClass('inline', 'inlineIconic')
				// Text content survives the clip; it is what keeps the accessible name.
				expect(profile, key).toHaveTextContent(label)
				expect(profile, key).toHaveAccessibleName(label)
			}
		},
	)
})

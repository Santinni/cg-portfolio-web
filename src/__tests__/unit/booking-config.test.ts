import { describe, expect, it } from 'vitest'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'
import { bookingConfig } from '@/content/booking'
import { contact } from '@/content/site'

const bookingTreeKeys = ['metadata', 'hero', 'offer', 'embed', 'fallbacks', 'entryPoints'] as const
const entryPointKeys = ['contact', 'experience', 'curriculumVitae', 'caseStudy'] as const

function collectObjectKeys(value: unknown): string[] {
	if (!value || typeof value !== 'object') return []

	return Object.entries(value).flatMap(([key, nestedValue]) => [
		key,
		...collectObjectKeys(nestedValue),
	])
}

describe('booking configuration', () => {
	it('freezes the introductory offer and exact Google appointment schedule', () => {
		expect(bookingConfig.offerId).toBe('introductoryConsultation')
		expect(bookingConfig.appointmentScheduleUrl).toBe(
			'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1C4Xr8kHc-vu8Mr9Yivuejsv52uG4U0TwcpvlKKx68ItOEY9ZN5yiWwbNHOUPMPGqaFHSL8Dbb?gv=true',
		)

		const scheduleUrl = new URL(bookingConfig.appointmentScheduleUrl)
		expect(scheduleUrl.protocol).toBe('https:')
		expect(scheduleUrl.hostname).toBe('calendar.google.com')
		expect(scheduleUrl.pathname).toBe(
			'/calendar/appointments/schedules/AcZssZ1C4Xr8kHc-vu8Mr9Yivuejsv52uG4U0TwcpvlKKx68ItOEY9ZN5yiWwbNHOUPMPGqaFHSL8Dbb',
		)
		expect(scheduleUrl.searchParams.get('gv')).toBe('true')
	})

	it('derives the public email from the central contact source', () => {
		expect(bookingConfig.contact).toEqual({
			email: contact.email,
			emailHref: `mailto:${contact.email}`,
		})
	})

	it('contains no localized copy or unverified scheduling claims', () => {
		expect(Object.keys(bookingConfig)).toEqual(['offerId', 'appointmentScheduleUrl', 'contact'])
		expect(Object.keys(bookingConfig.contact)).toEqual(['email', 'emailHref'])

		const configKeys = collectObjectKeys(bookingConfig)
		for (const field of ['duration', 'price', 'timezone', 'availability', 'owner']) {
			expect(configKeys).not.toContain(field)
		}
	})

	it.each([
		{ locale: 'en', messages: enMessages },
		{ locale: 'cs', messages: csMessages },
	])('provides the required localized $locale booking tree', ({ messages }) => {
		expect(Object.keys(messages.booking)).toEqual(bookingTreeKeys)
		expect(Object.keys(messages.booking.entryPoints)).toEqual(entryPointKeys)

		for (const entryPoint of entryPointKeys) {
			expect(Object.keys(messages.booking.entryPoints[entryPoint])).toEqual([
				'eyebrow',
				'title',
				'body',
				'action',
			])
		}
	})
})

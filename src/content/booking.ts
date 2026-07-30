import { contact } from './site'

export const bookingConfig = {
	offerId: 'introductoryConsultation',
	appointmentScheduleUrl:
		'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1C4Xr8kHc-vu8Mr9Yivuejsv52uG4U0TwcpvlKKx68ItOEY9ZN5yiWwbNHOUPMPGqaFHSL8Dbb?gv=true',
	contact: {
		email: contact.email,
		emailHref: `mailto:${contact.email}`,
	},
} as const

export type BookingOfferId = typeof bookingConfig.offerId

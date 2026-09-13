import { contact } from './site'

export interface ContactMethod {
	key: 'email' | 'location' | 'linkedin' | 'github'
	value: string
	href?: string
	external?: boolean
}

/**
 * Locale-neutral contact destinations, derived from the single contact source in
 * `site.ts` so the CV page, the contact page and any later surface cannot drift apart.
 * Labels and the location presentation live in messages.
 */
export const contactMethods: readonly ContactMethod[] = [
	{
		key: 'email',
		value: contact.email,
		href: `mailto:${contact.email}`,
	},
	{
		key: 'location',
		value: '',
	},
	{
		key: 'linkedin',
		value: 'karelkutchan',
		href: contact.linkedin,
		external: true,
	},
	{
		key: 'github',
		value: 'Santinni',
		href: contact.github,
		external: true,
	},
] as const

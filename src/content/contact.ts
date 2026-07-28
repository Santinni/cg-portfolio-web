export interface ContactMethod {
	key: 'email' | 'location' | 'linkedin' | 'github'
	value: string
	href?: string
	external?: boolean
}

/** Locale-neutral contact destinations. Labels and the location presentation live in messages. */
export const contactMethods: readonly ContactMethod[] = [
	{
		key: 'email',
		value: 'karel@codeguy.cz',
		href: 'mailto:karel@codeguy.cz',
	},
	{
		key: 'location',
		value: '',
	},
	{
		key: 'linkedin',
		value: 'karelkutchan',
		href: 'https://www.linkedin.com/in/karelkutchan/',
		external: true,
	},
	{
		key: 'github',
		value: 'Santinni',
		href: 'https://github.com/Santinni',
		external: true,
	},
] as const

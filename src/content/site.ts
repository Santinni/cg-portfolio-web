export const siteConfig = {
	name: 'Codeguy',
	brand: 'Codeguy',
	url: 'https://codeguy.cz',
} as const

/** Locale-neutral public routes rendered in the primary navigation. */
export const primaryNav = [
	{ key: 'work', href: '/work' },
	{ key: 'experience', href: '/experience' },
	{ key: 'about', href: '/about' },
	{ key: 'contact', href: '/contact' },
	{ key: 'insights', href: '/insights' },
] as const

export const contact = {
	email: 'karel@codeguy.cz',
	linkedin: 'https://www.linkedin.com/in/karelkutchan/',
	github: 'https://github.com/Santinni',
} as const

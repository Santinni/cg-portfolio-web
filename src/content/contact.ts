export interface ContactMethod {
	label: string
	value: string
	href?: string
	external?: boolean
}

export const contactPage = {
	eyebrow: 'CONTACT',
	title: 'Let’s discuss the product, the team and the frontend problems worth solving.',
	intro:
		'I am primarily looking for the right senior or lead frontend role. Selected consulting conversations are welcome when the fit is specific.',
	methods: [
		{
			label: 'Email',
			value: 'karel@codeguy.cz',
			href: 'mailto:karel@codeguy.cz',
		},
		{
			label: 'Location',
			value: 'Prague, Czech Republic',
		},
		{
			label: 'LinkedIn',
			value: 'karelkutchan',
			href: 'https://www.linkedin.com/in/karelkutchan/',
			external: true,
		},
		{
			label: 'GitHub',
			value: 'Santinni',
			href: 'https://github.com/Santinni',
			external: true,
		},
	] satisfies ContactMethod[],
	expectations: {
		title: 'Useful first context',
		body:
			'What you are building, where frontend ownership currently sits, and what success would look like in the first months.',
	},
} as const

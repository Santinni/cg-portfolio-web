export interface ExperienceEntry {
	role: string
	description: string
}

export const experiencePage = {
	eyebrow: 'EXPERIENCE / CV',
	title: 'More than ten years building for the web.',
	intro:
		'Senior frontend engineering across customer portals, enterprise applications, energy products and component systems.',
	timeline: [
		{
			role: 'Lead Frontend Engineer',
			description:
				'Leading frontend architecture, delivery practices and technical decisions across product teams.',
		},
		{
			role: 'Senior Frontend Engineer',
			description:
				'Building resilient product interfaces and reusable component foundations for complex applications.',
		},
		{
			role: 'Frontend Engineer',
			description:
				'Delivering customer-facing and internal web applications in close collaboration with design and backend teams.',
		},
		{
			role: 'Web Developer',
			description:
				'Creating responsive websites and developing the practical engineering foundation for long-term product work.',
		},
	] satisfies ExperienceEntry[],
	capabilities:
		'React · TypeScript · Next.js · Storybook · React Aria · Playwright · Vitest/Jest · frontend architecture · accessibility · component systems · code review · team leadership',
} as const

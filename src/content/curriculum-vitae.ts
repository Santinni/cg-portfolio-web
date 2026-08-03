import { contact } from './site'

export const curriculumVitaeExperience = [
	{
		id: 'blueghost',
		stack: [
			'Next.js',
			'React',
			'TypeScript',
			'PNPM',
			'TanStack React Query',
			'Zustand',
			'SCSS Modules',
			'Storybook',
			'React Aria',
			'Vitest',
			'Playwright',
			'Git',
		],
		company: 'BlueGhost',
		roleId: 'leadFrontendEngineer',
		start: '2025-03',
		end: null,
	},
	{
		id: 'kontentAi',
		stack: [
			'React',
			'TypeScript',
			'Next.js',
			'styled-components',
			'React Aria',
			'Storybook',
			'Playwright',
			'Git',
		],
		company: 'Kontent.ai',
		roleId: 'frontendEngineer',
		start: '2024-06',
		end: '2025-02',
		engagement: 'contract',
	},
	{
		id: 'tldrit',
		stack: ['Next.js', 'React', 'TypeScript', 'Sass', 'CSS Modules', 'Payload CMS'],
		company: 'TLDR;IT s.r.o.',
		roleId: 'leadFrontendEngineer',
		start: '2024-04',
		end: '2024-09',
		engagement: 'contract',
	},
	{
		id: 'eman',
		stack: [
			'React',
			'Next.js',
			'TypeScript',
			'MobX',
			'Redux',
			'Sass',
			'CSS Modules',
			'Storybook',
			'Git',
		],
		company: 'eMan a.s.',
		roleId: 'frontendEngineer',
		start: '2021-09',
		end: '2024-04',
	},
	{
		id: 'lmc',
		stack: ['React', 'JavaScript', 'PHP/Twig', 'Less', 'Sass'],
		company: 'LMC',
		roleId: 'frontendEngineer',
		start: '2020-09',
		end: '2021-09',
	},
	{
		id: 'ampX',
		stack: ['React', 'TypeScript', 'Redux', 'JSS', 'Storybook', 'Git'],
		company: 'Amp X',
		roleId: 'frontendEngineer',
		start: '2019-09',
		end: '2020-09',
	},
	{
		id: 'skype',
		stack: ['JavaScript', 'jQuery', 'HTML5', 'CSS3', 'Sass', 'Kentico CMS', 'Git'],
		company: 'Skype.com',
		roleId: 'frontendEngineer',
		start: '2019-04',
		end: '2019-09',
	},
	{
		id: 'foxconn',
		stack: ['HTML5', 'CSS3', 'Sass', 'React', 'BEM', 'Git'],
		company: 'Foxconn DRC s.r.o.',
		roleId: 'frontendCoder',
		start: '2018-06',
		end: '2019-03',
	},
	{
		id: 'mountfield',
		stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Kentico CMS'],
		company: 'Mountfield, a.s.',
		roleId: 'frontendCoder',
		start: '2017-05',
		end: '2018-05',
	},
	{
		// Start of the web career. This entry is what substantiates the
		// "more than ten years" claim in positioning.
		id: 'bitware',
		stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PHP', 'WordPress'],
		company: 'BitWare CZ s.r.o.',
		roleId: 'webmaster',
		start: '2014-08',
		end: '2017-05',
	},
] as const

/**
 * Pre-web career, listed as a one-line footnote rather than a timeline entry.
 * Kept out of curriculumVitaeExperience so it does not dilute the frontend
 * chronology or count towards the "more than ten years in web" claim.
 * Years only — these predate the month-level records.
 */
export const curriculumVitaeEarlierExperience = [
	{
		id: 'austroBohemia',
		company: 'Austro-Bohemia',
		start: '2011',
		end: '2014',
	},
] as const

export const curriculumVitaeHighlights = [
	{ id: 'experience' },
	{ id: 'currentRole' },
	{ id: 'productSystems' },
	{ id: 'location' },
] as const

export const curriculumVitaeSkills = [
	{ id: 'frontendEngineering' },
	{ id: 'stateAndData' },
	{ id: 'validationAndForms' },
	{ id: 'cssUiSystems' },
	{ id: 'cmsPlatformIntegration' },
	{ id: 'qualityAndTooling' },
	{ id: 'accessibilityI18n' },
] as const

export const curriculumVitaeProjects = [
	{ id: 'frontendLeadership', experienceId: 'blueghost' },
	{ id: 'accessibilityRefactoring', experienceId: 'kontentAi' },
	{ id: 'energyCustomerPortals', experienceId: 'eman' },
	{ id: 'skypeWebPlatform', experienceId: 'skype' },
] as const

export const curriculumVitaeEducation = [
	{
		id: 'copth',
		institution: 'COPTH',
		start: '2002',
		end: '2006',
	},
] as const

export const curriculumVitaeLanguages = [
	{ id: 'czech', levelId: 'native' },
	{ id: 'english', levelId: 'workingProfessional' },
	{ id: 'swedish', levelId: 'beginner' },
] as const

export const curriculumVitaePdfByLocale = {
	en: {
		href: '/curriculum-vitae/CV_Karel_Kutchan.pdf',
		language: 'en',
		profile: 'react',
	},
	cs: {
		href: '/curriculum-vitae/CV_Karel_Kutchan_CS.pdf',
		language: 'cs',
		profile: 'general',
	},
} as const

export const curriculumVitae = {
	person: {
		name: 'Karel Kutchan',
		locationId: 'pragueCzechRepublic',
	},
	contact: {
		email: contact.email,
		emailHref: `mailto:${contact.email}`,
		linkedin: contact.linkedin,
		github: contact.github,
		// CV-only fact: the public CV page renders email, LinkedIn and GitHub.
		// This feeds the generated PDF, which requires a phone number.
		phone: '+420 605 570 494',
		phoneHref: 'tel:+420605570494',
	},
	positioning: {
		roleId: 'seniorFrontendEngineer',
		minimumYearsInWeb: 10,
		experienceQualifier: 'moreThan',
	},
	currentExperienceId: 'blueghost',
	experience: curriculumVitaeExperience,
	earlierExperience: curriculumVitaeEarlierExperience,
	highlights: curriculumVitaeHighlights,
	skills: curriculumVitaeSkills,
	projects: curriculumVitaeProjects,
	education: curriculumVitaeEducation,
	languages: curriculumVitaeLanguages,
	pdfByLocale: curriculumVitaePdfByLocale,
} as const

export type CurriculumVitaeLocale = keyof typeof curriculumVitaePdfByLocale
export type CurriculumVitaeExperienceId = (typeof curriculumVitaeExperience)[number]['id']
export type CurriculumVitaeEarlierExperienceId =
	(typeof curriculumVitaeEarlierExperience)[number]['id']
export type CurriculumVitaeHighlightId = (typeof curriculumVitaeHighlights)[number]['id']
export type CurriculumVitaeSkillId = (typeof curriculumVitaeSkills)[number]['id']
export type CurriculumVitaeProjectId = (typeof curriculumVitaeProjects)[number]['id']

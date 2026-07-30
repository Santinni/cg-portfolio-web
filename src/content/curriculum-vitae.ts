import { contact } from './site'

export const curriculumVitaeExperience = [
	{
		id: 'blueghost',
		company: 'BlueGhost',
		roleId: 'leadFrontendEngineer',
		start: '2025-03',
		end: null,
	},
	{
		id: 'kontentAi',
		company: 'Kontent.ai',
		roleId: 'frontendEngineer',
		start: '2024-06',
		end: '2025-02',
		engagement: 'contract',
	},
	{
		id: 'tldrit',
		company: 'TLDR;IT s.r.o.',
		roleId: 'leadFrontendEngineer',
		start: '2024-04',
		end: '2024-09',
		engagement: 'contract',
	},
	{
		id: 'eman',
		company: 'eMan a.s.',
		roleId: 'frontendEngineer',
		start: '2021-09',
		end: '2024-04',
	},
	{
		id: 'lmc',
		company: 'LMC',
		roleId: 'frontendEngineer',
		start: '2020-09',
		end: '2021-09',
	},
	{
		id: 'ampX',
		company: 'Amp X',
		roleId: 'frontendEngineer',
		start: '2019-09',
		end: '2020-09',
	},
	{
		id: 'skype',
		company: 'Skype.com',
		roleId: 'frontendEngineer',
		start: '2019-04',
		end: '2019-09',
	},
	{
		id: 'foxconn',
		company: 'Foxconn DRC s.r.o.',
		roleId: 'frontendCoder',
		start: '2018-06',
		end: '2019-03',
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
	{ id: 'english', levelId: 'fluent' },
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
	},
	positioning: {
		roleId: 'seniorFrontendEngineer',
		minimumYearsInWeb: 10,
		experienceQualifier: 'moreThan',
	},
	currentExperienceId: 'blueghost',
	experience: curriculumVitaeExperience,
	highlights: curriculumVitaeHighlights,
	skills: curriculumVitaeSkills,
	projects: curriculumVitaeProjects,
	education: curriculumVitaeEducation,
	languages: curriculumVitaeLanguages,
	pdfByLocale: curriculumVitaePdfByLocale,
} as const

export type CurriculumVitaeLocale = keyof typeof curriculumVitaePdfByLocale
export type CurriculumVitaeExperienceId = (typeof curriculumVitaeExperience)[number]['id']
export type CurriculumVitaeHighlightId = (typeof curriculumVitaeHighlights)[number]['id']
export type CurriculumVitaeSkillId = (typeof curriculumVitaeSkills)[number]['id']
export type CurriculumVitaeProjectId = (typeof curriculumVitaeProjects)[number]['id']

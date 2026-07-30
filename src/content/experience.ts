export const experienceEntryKeys = [
	'leadFrontendEngineer',
	'seniorFrontendEngineer',
	'frontendEngineer',
	'webDeveloper',
] as const

export type ExperienceEntryKey = (typeof experienceEntryKeys)[number]

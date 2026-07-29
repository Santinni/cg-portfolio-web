export type WorkKey =
	| 'energyCustomerPortal'
	| 'maintenanceApplications'
	| 'distributedEnergyPlatform'
	| 'accessibilityRefactoring'

export interface WorkItem {
	key: WorkKey
	slug: string
	stack: readonly string[]
	status: 'available' | 'pending'
	href?: `/work/${string}`
}

export const caseStudySectionKeys = [
	'context',
	'responsibility',
	'decisions',
	'outcome',
	'reflection',
] as const

export interface CaseStudy {
	key: Exclude<WorkKey, 'accessibilityRefactoring'>
	slug: string
	hasRole: boolean
	stack: readonly string[]
}

export const flagshipWork = {
	key: 'energyCustomerPortal',
	slug: 'energy-customer-portal',
	stack: ['React', 'TypeScript', 'Next.js', 'Storybook', 'Playwright'],
	href: '/work/energy-customer-portal',
} as const

/** Selected work cards shown beneath the flagship case. */
export const selectedWork: readonly WorkItem[] = [
	{
		key: 'maintenanceApplications',
		slug: 'maintenance-applications',
		stack: ['React', 'TypeScript'],
		status: 'available',
		href: '/work/maintenance-applications',
	},
	{
		key: 'distributedEnergyPlatform',
		slug: 'distributed-energy-platform',
		stack: ['React', 'TypeScript'],
		status: 'available',
		href: '/work/distributed-energy-platform',
	},
	{
		key: 'accessibilityRefactoring',
		slug: 'accessibility-refactoring',
		stack: ['React', 'TypeScript'],
		status: 'pending',
	},
]

export const workItems: readonly WorkItem[] = [
	{
		key: flagshipWork.key,
		slug: flagshipWork.slug,
		stack: flagshipWork.stack,
		status: 'available',
		href: flagshipWork.href,
	},
	...selectedWork,
]

/** NDA-safe launch case studies, in the order used by case-to-case navigation. */
export const caseStudies = [
	{
		key: 'energyCustomerPortal',
		slug: 'energy-customer-portal',
		hasRole: true,
		stack: ['React', 'TypeScript', 'Next.js'],
	},
	{
		key: 'maintenanceApplications',
		slug: 'maintenance-applications',
		hasRole: false,
		stack: ['React', 'TypeScript'],
	},
	{
		key: 'distributedEnergyPlatform',
		slug: 'distributed-energy-platform',
		hasRole: false,
		stack: ['React', 'TypeScript'],
	},
] as const satisfies readonly CaseStudy[]

export type CaseStudySlug = (typeof caseStudies)[number]['slug']

export function getCaseStudy(slug: string): CaseStudy | undefined {
	return caseStudies.find((caseStudy) => caseStudy.slug === slug)
}

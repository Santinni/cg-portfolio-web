export interface WorkItem {
  slug: string
  eyebrow: string
  title: string
  summary: string
  stack: string[]
  status: 'available' | 'pending'
  href?: string
}

export interface CaseStudySection {
  eyebrow: string
  heading: string
  body: string
}

export interface CaseStudy {
  slug: string
  eyebrow: string
  title: string
  description: string
  role?: string
  focus: string
  stack: string[]
  sections: readonly CaseStudySection[]
}

/**
 * Flagship case featured on its own Home section.
 * Title has a desktop and a compact variant per the approved layout.
 */
export const flagshipWork = {
  slug: 'energy-customer-portal',
  eyebrow: 'FLAGSHIP CASE / ENERGY',
  titleDesktop: 'A customer portal built as a system, not a collection of screens.',
  titleCompact: 'A customer portal built as a system.',
  summary:
    'Frontend leadership for a customer-facing energy product: architecture, component foundations, delivery quality and accessibility across a growing application.',
  stack: ['React', 'TypeScript', 'Next.js', 'Storybook', 'Playwright'],
  ctaLabel: 'Read the case',
  href: '/work/energy-customer-portal',
  systemMap: [
    { label: 'PRODUCT UI', description: 'Customer journeys' },
    { label: 'SHARED COMPONENTS', description: 'Accessible foundations · Tests · Delivery' },
  ],
} as const

/** Selected work cards shown beneath the flagship case. */
export const selectedWork: WorkItem[] = [
  {
    slug: 'maintenance-applications',
    eyebrow: 'ENTERPRISE',
    title: 'Maintenance applications',
    summary:
      'Reusable frontend architecture for enterprise maintenance workflows.',
    stack: ['React', 'TypeScript'],
    status: 'available',
    href: '/work/maintenance-applications',
  },
  {
    slug: 'distributed-energy-platform',
    eyebrow: 'ENERGY PLATFORM',
    title: 'Distributed energy platform',
    summary:
      'Frontend foundations for a complex distributed-energy product.',
    stack: ['React', 'TypeScript'],
    status: 'available',
    href: '/work/distributed-energy-platform',
  },
  {
    slug: 'accessibility-refactoring',
    eyebrow: 'ACCESSIBILITY',
    title: 'Accessibility refactoring',
    summary:
      'Practical accessibility improvements inside an established product.',
    stack: ['React', 'TypeScript'],
    status: 'pending',
  },
]

/** Complete Work index. Accessibility remains intentionally unavailable until its detail is designed. */
export const workItems: WorkItem[] = [
  {
    slug: flagshipWork.slug,
    eyebrow: flagshipWork.eyebrow,
    title: flagshipWork.titleDesktop,
    summary: flagshipWork.summary,
    stack: [...flagshipWork.stack],
    status: 'available',
    href: flagshipWork.href,
  },
  ...selectedWork,
]

/** NDA-safe launch case studies, in the order used by case-to-case navigation. */
export const caseStudies = [
  {
    slug: 'energy-customer-portal',
    eyebrow: 'FLAGSHIP CASE / ENERGY',
    title: 'A customer portal built as a system, not a collection of screens.',
    description:
      'A customer-facing energy portal with growing product scope, multiple journeys and a need for reliable delivery.',
    role: 'Lead frontend engineering',
    focus:
      'Frontend architecture, component foundations, accessibility, testing strategy, review quality and team guidance.',
    stack: ['React', 'TypeScript', 'Next.js'],
    sections: [
      {
        eyebrow: '01 / CONTEXT',
        heading: 'The product context',
        body: 'A customer-facing energy portal with growing product scope, multiple journeys and a need for reliable delivery.',
      },
      {
        eyebrow: '02 / RESPONSIBILITY',
        heading: 'What I owned',
        body: 'Frontend architecture, component foundations, accessibility, testing strategy, review quality and team guidance.',
      },
      {
        eyebrow: '03 / DECISIONS',
        heading: 'The decisions that mattered',
        body: 'Establish reusable boundaries, keep component behavior accessible, and use Storybook and browser tests where they reduce regression risk.',
      },
      {
        eyebrow: '04 / OUTCOME',
        heading: 'What changed',
        body: 'A more coherent frontend foundation for continued product delivery. No invented performance or business metrics are claimed.',
      },
      {
        eyebrow: '05 / REFLECTION',
        heading: 'What I would carry forward',
        body: 'Strong frontend work leaves the next change easier to reason about. The durable result is a clearer system, not only a shipped screen.',
      },
    ],
  },
  {
    slug: 'maintenance-applications',
    eyebrow: 'ENTERPRISE',
    title: 'Reusable architecture for enterprise maintenance workflows.',
    description:
      'Internal maintenance products combine dense data, specialist workflows and long-lived operational needs.',
    focus:
      'Frontend implementation, architecture, reusable patterns and collaboration across product constraints.',
    stack: ['React', 'TypeScript'],
    sections: [
      {
        eyebrow: '01 / CONTEXT',
        heading: 'The product context',
        body: 'Internal maintenance products combine dense data, specialist workflows and long-lived operational needs.',
      },
      {
        eyebrow: '02 / RESPONSIBILITY',
        heading: 'What I owned',
        body: 'Frontend implementation, architecture, reusable patterns and collaboration across product constraints.',
      },
      {
        eyebrow: '03 / DECISIONS',
        heading: 'The decisions that mattered',
        body: 'Separate repeatable workflow patterns from product-specific detail; keep complex interfaces scannable and predictable.',
      },
      {
        eyebrow: '04 / OUTCOME',
        heading: 'What changed',
        body: 'A clearer reusable base for continued work across maintenance applications.',
      },
      {
        eyebrow: '05 / REFLECTION',
        heading: 'What I would carry forward',
        body: 'The useful outcome is a frontend structure that helps the next team decision become clearer and less expensive.',
      },
    ],
  },
  {
    slug: 'distributed-energy-platform',
    eyebrow: 'ENERGY PLATFORM',
    title: 'Frontend foundations for a distributed-energy platform.',
    description:
      'A complex energy platform connected operational data, control surfaces and evolving product requirements.',
    focus: 'Frontend engineering across product UI, shared foundations and delivery quality.',
    stack: ['React', 'TypeScript'],
    sections: [
      {
        eyebrow: '01 / CONTEXT',
        heading: 'The product context',
        body: 'A complex energy platform connected operational data, control surfaces and evolving product requirements.',
      },
      {
        eyebrow: '02 / RESPONSIBILITY',
        heading: 'What I owned',
        body: 'Frontend engineering across product UI, shared foundations and delivery quality.',
      },
      {
        eyebrow: '03 / DECISIONS',
        heading: 'The decisions that mattered',
        body: 'Prefer explicit state and component boundaries; make operational information easy to scan and hard to misread.',
      },
      {
        eyebrow: '04 / OUTCOME',
        heading: 'What changed',
        body: 'A maintainable frontend base supporting an evolving energy product.',
      },
      {
        eyebrow: '05 / REFLECTION',
        heading: 'What I would carry forward',
        body: 'The useful outcome is a frontend structure that helps the next team decision become clearer and less expensive.',
      },
    ],
  },
] as const satisfies readonly CaseStudy[]

export type CaseStudySlug = (typeof caseStudies)[number]['slug']

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug)
}

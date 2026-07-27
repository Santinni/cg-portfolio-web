export interface CtaLink {
  label: string
  href: string
}

export const hero = {
  eyebrow: 'SENIOR FRONTEND ENGINEER / PRAGUE',
  headline: 'I build frontend systems for products that have to last.',
  paragraphs: [
    'More than ten years in web development, currently in a lead frontend role. I work with React, TypeScript and Next.js across customer portals, internal enterprise applications and the component libraries underneath them.',
    'Architecture, accessibility and long-term maintainability are part of the delivery, not follow-up work.',
  ],
  primaryCta: { label: 'Read flagship case', href: '/work/energy-customer-portal' } satisfies CtaLink,
  secondaryCta: { label: 'View experience', href: '/experience' } satisfies CtaLink,
}

export interface Principle {
  title: string
  description: string
}

export const principlesSection = {
  titleDesktop: 'Senior engineering is mostly about making good decisions repeatable.',
  titleCompact: 'Good decisions should be repeatable.',
  items: [
    {
      title: 'Architecture with a reason',
      description: 'Choose boundaries and patterns that reduce product risk.',
    },
    {
      title: 'Accessibility by default',
      description: 'Build inclusive behavior into components and reviews.',
    },
    {
      title: 'Quality that supports delivery',
      description: 'Use tests, tooling and feedback where they protect change.',
    },
    {
      title: 'Leadership through clarity',
      description: 'Make trade-offs visible and help teams move with confidence.',
    },
  ] satisfies Principle[],
}

export const experienceSnapshot = {
  eyebrow: 'EXPERIENCE',
  title: 'From implementation to frontend leadership.',
  description:
    'Web development since 2014. Today I lead frontend work across architecture, component systems, accessibility, testing and code review.',
  cta: { label: 'View full experience', href: '/experience' } satisfies CtaLink,
}

export const finalCta = {
  heading: 'Looking for a senior frontend engineer who can own the system behind the interface?',
  supporting:
    'I am primarily interested in the right product and team. Selected consulting conversations are welcome.',
  cta: { label: 'Start a conversation', href: '/contact' } satisfies CtaLink,
}

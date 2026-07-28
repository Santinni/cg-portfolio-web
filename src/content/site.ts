export interface NavItem {
  label: string
  href: string
}

export const siteConfig = {
  name: 'Codeguy',
  brand: 'Codeguy',
  title: 'Karel Kutchan — Senior Frontend Engineer',
  description:
    'Karel Kutchan is a senior frontend engineer based in Prague, building resilient frontend systems with React, TypeScript and Next.js.',
  url: 'https://codeguy.cz',
  locale: 'en_US',
} as const

/** Primary navigation, shown in the desktop header and mobile menu. */
export const primaryNav: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Experience', href: '/experience' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Insights', href: '/insights' },
]

export const contact = {
  email: 'karel@codeguy.cz',
  linkedin: 'https://www.linkedin.com/in/karelkutchan/',
  github: 'https://github.com/Santinni',
  location: 'Prague, Czech Republic',
} as const

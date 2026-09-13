import { ArrowUpRight } from 'lucide-react'

import { GitHubIcon, LinkedInIcon } from '@/app/(frontend)/components/icons/BrandIcons'
import type { ContactMethod } from '@/content/contact'

import styles from './ContactLink.module.css'

type BrandKey = 'github' | 'linkedin'

/**
 * Only external profiles have a brand mark to fall back to. A direct channel is named by
 * its value, which no glyph can replace, so e-mail and location never enter icon density.
 */
function hasBrandGlyph(key: ContactMethod['key'] | undefined): key is BrandKey {
	return key === 'github' || key === 'linkedin'
}

/**
 * `data-contact-glyph="brand"` exists for the tests. CSS Module class names are hashed in a
 * build, so without a stable hook a test asserting "the brand mark is present" would depend
 * on an implementation detail rather than a contract we own.
 */
function BrandGlyph({ methodKey }: { methodKey: BrandKey }) {
	return methodKey === 'github' ? (
		<GitHubIcon className={styles.inlineBrand} data-contact-glyph="brand" aria-hidden="true" />
	) : (
		<LinkedInIcon className={styles.inlineBrand} data-contact-glyph="brand" aria-hidden="true" />
	)
}

interface ResolvedContactMethod extends Omit<ContactMethod, 'key'> {
	key?: ContactMethod['key']
	label: string
}

type ContactLinkVariant = 'row' | 'inline'

interface ContactLinkProps {
	method: ResolvedContactMethod
	/** `row` is the labelled contact-page row; `inline` is the compact hero token. */
	variant?: ContactLinkVariant
}

/**
 * The single contact contract for every surface: e-mail and external profiles keep real
 * anchor semantics, location stays non-interactive, and both variants meet the 44px
 * target. `mailto:` never opens a new tab.
 *
 * `row` (the `/contact` list) always shows a label, a value and the arrow affordance --
 * that page is a directory, browsed deliberately, so every method reads the same way.
 *
 * `inline` (the CV hero, and the homepage hero via COD-79) draws a sharper line: a direct
 * channel is a value worth reading, an external profile is a destination worth recognizing.
 * E-mail stays an underlined text token. LinkedIn and GitHub render as a 44px brand-mark
 * button at every width, with no arrow and no visible label -- the two marks are globally
 * recognizable, so the icon alone carries the destination, and the flattened hierarchy
 * lets the e-mail token read as the one channel actually worth acting on.
 *
 * This replaced a width-switched version that showed the label and an arrow above 768px:
 * the arrow pushed the CV's mobile row past its content column and cost a 52px line (see
 * `docs/audits/2026-09-03-cv-contact-wrap.md`), and once the fix was in front of us, one
 * rule for every width read better than a responsive switch with nothing left to switch
 * for. The label is clipped, not removed, so it stays the anchor's accessible name and its
 * text content -- density is presentation only, and `data-contact-method`, href, target
 * and rel never change.
 */
export function ContactLink({ method, variant = 'row' }: ContactLinkProps) {
	const isInline = variant === 'inline'
	const brandKey = isInline && method.external && hasBrandGlyph(method.key) ? method.key : undefined

	const content = isInline ? (
		<>
			{brandKey ? <BrandGlyph methodKey={brandKey} /> : null}
			<span className={styles.inlineText}>{method.external ? method.label : method.value}</span>
		</>
	) : (
		<>
			<span className={styles.label}>{method.label}</span>
			<span className={styles.value}>{method.value}</span>
			{method.href ? <ArrowUpRight className={styles.icon} aria-hidden="true" /> : null}
		</>
	)

	const shell = isInline
		? brandKey
			? `${styles.inline} ${styles.inlineIconic}`
			: styles.inline
		: styles.row

	if (!method.href) {
		return (
			<div className={shell} data-contact-method={method.key}>
				{content}
			</div>
		)
	}

	const linkClass = isInline ? styles.inlineLink : styles.rowLink

	return (
		<a
			className={`${shell} ${linkClass}`}
			data-contact-method={method.key}
			href={method.href}
			target={method.external ? '_blank' : undefined}
			rel={method.external ? 'noopener noreferrer' : undefined}
		>
			{content}
		</a>
	)
}

import { ArrowUpRight } from 'lucide-react'

import type { ContactMethod } from '@/content/contact'

import styles from './ContactLink.module.css'

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
 * target. External profiles carry the arrow affordance; `mailto:` never opens a new tab.
 *
 * Inline text names an external profile by its platform label and a direct channel by its
 * value, because a profile is recognized by where it lives and a channel by the address
 * the visitor will actually use.
 */
export function ContactLink({ method, variant = 'row' }: ContactLinkProps) {
	const isInline = variant === 'inline'

	const content = isInline ? (
		<>
			<span className={styles.inlineText}>{method.external ? method.label : method.value}</span>
			{method.external ? <ArrowUpRight className={styles.inlineIcon} aria-hidden="true" /> : null}
		</>
	) : (
		<>
			<span className={styles.label}>{method.label}</span>
			<span className={styles.value}>{method.value}</span>
			{method.href ? <ArrowUpRight className={styles.icon} aria-hidden="true" /> : null}
		</>
	)

	const shell = isInline ? styles.inline : styles.row

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

import { ArrowUpRight } from 'lucide-react'

import type { ContactMethod } from '@/content/contact'

import styles from './ContactLink.module.css'

interface ContactLinkProps {
	method: ContactMethod
}

/** Accessible contact row; location remains text while actionable methods meet 44px targets. */
export function ContactLink({ method }: ContactLinkProps) {
	const content = (
		<>
			<span className={styles.label}>{method.label}</span>
			<span className={styles.value}>{method.value}</span>
			{method.href ? <ArrowUpRight className={styles.icon} aria-hidden="true" /> : null}
		</>
	)

	if (!method.href) {
		return <div className={styles.row}>{content}</div>
	}

	return (
		<a
			className={`${styles.row} ${styles.link}`}
			href={method.href}
			target={method.external ? '_blank' : undefined}
			rel={method.external ? 'noopener noreferrer' : undefined}
		>
			{content}
		</a>
	)
}

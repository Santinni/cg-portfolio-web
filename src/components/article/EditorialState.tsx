import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import styles from './Article.module.css'

export type EditorialStateKind = 'empty' | 'error' | 'loading'

export interface EditorialStateProps {
	actionHref?: string
	actionLabel?: string
	description?: string
	kind: EditorialStateKind
	title?: string
}

export function EditorialState({
	actionHref,
	actionLabel,
	description,
	kind,
	title,
}: EditorialStateProps) {
	const t = useTranslations('article.states')
	const resolvedTitle = title ?? t(kind)

	if (kind === 'loading') {
		return (
			<section className={styles.editorialState} aria-busy="true" aria-label={resolvedTitle}>
				<span className={styles.skeleton} />
				<span className={`${styles.skeleton} ${styles.skeletonShort}`} />
			</section>
		)
	}

	return (
		<section className={styles.editorialState}>
			<h2 className={styles.stateTitle}>{resolvedTitle}</h2>
			{description ? <p className={styles.stateDescription}>{description}</p> : null}
			{actionHref && actionLabel ? (
				<Link className={styles.stateAction} href={actionHref}>
					{actionLabel}
				</Link>
			) : null}
		</section>
	)
}

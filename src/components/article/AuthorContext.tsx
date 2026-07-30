import Link from 'next/link'
import { useTranslations } from 'next-intl'

import styles from './Article.module.css'
import type { AuthorData } from './types'

export interface AuthorContextProps extends AuthorData {
	heading?: string
}

export function AuthorContext({ avatar, bio, heading, href, name, role }: AuthorContextProps) {
	const t = useTranslations('article.author')
	const resolvedHeading = heading ?? t('heading')

	return (
		<aside className={styles.author} aria-label={resolvedHeading}>
			{avatar ? <div className={styles.authorAvatar}>{avatar}</div> : null}
			<div className={styles.authorBody}>
				<p className={styles.eyebrow}>{resolvedHeading}</p>
				<h2 className={styles.authorName} lang="en">
					{href ? <Link href={href}>{name}</Link> : name}
				</h2>
				{role ? (
					<p className={styles.authorRole} lang="en">
						{role}
					</p>
				) : null}
				{bio ? (
					<p className={styles.authorBio} lang="en">
						{bio}
					</p>
				) : null}
			</div>
		</aside>
	)
}

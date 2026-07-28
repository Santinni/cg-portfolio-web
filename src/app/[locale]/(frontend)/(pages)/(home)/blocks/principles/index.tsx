import { Container } from '@/app/(frontend)/components/layout/Container'
import { getTranslations } from 'next-intl/server'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'
import { principleKeys } from '@/content/profile'

import styles from './Principles.module.css'

/** Contrast-tone section stating the engineering principles behind the work. */
export default async function Principles() {
	const t = await getTranslations('home.principles')

	return (
		<Section id="principles" aria-labelledby="principles-heading" tone="contrast">
			<Container>
				<Eyebrow className={styles.eyebrow}>{t('eyebrow')}</Eyebrow>
				<h2 id="principles-heading" className={styles.title}>
					<span className={styles.titleWide}>{t('titleDesktop')}</span>
					<span className={styles.titleCompact}>{t('titleCompact')}</span>
				</h2>
				<ul className={styles.grid}>
					{principleKeys.map((key) => (
						<li key={key} className={styles.item}>
							<h3 className={styles.itemTitle}>{t(`items.${key}.title`)}</h3>
							<p className={styles.itemDescription}>{t(`items.${key}.description`)}</p>
						</li>
					))}
				</ul>
			</Container>
		</Section>
	)
}

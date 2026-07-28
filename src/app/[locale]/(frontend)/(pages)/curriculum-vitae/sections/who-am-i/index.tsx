import { useTranslations } from 'next-intl'

import ExpandableText from '@/app/(frontend)/components/primitives/expandableText'
import styles from './WhoAmI.module.css'

/** "Who am I" section — short bio paragraphs in an expandable container. */
export const WhoAmI = () => {
	const t = useTranslations('curriculumVitae.biography')
	const data = [
		t('paragraphs.focus'),
		t('paragraphs.experience'),
		t('paragraphs.quality'),
		t('paragraphs.systems'),
		t('paragraphs.collaboration'),
	]

	return (
		<section className={styles.whoAmI} aria-labelledby="whoami-heading">
			<h2 id="whoami-heading" className={styles.sectionTitle}>
				{t('title')}
			</h2>
			<ExpandableText>
				<div className={styles.textWrapper}>
					{data.map((content, index) => (
						<p className={styles.whoAmIText} key={index}>
							{content}
						</p>
					))}
				</div>
			</ExpandableText>
		</section>
	)
}

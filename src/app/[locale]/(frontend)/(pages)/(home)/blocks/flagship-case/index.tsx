import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/app/(frontend)/components/primitives/button'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'
import { flagshipWork } from '@/content/work'

import styles from './FlagshipCase.module.css'

/** Flagship case study — energy customer portal. */
export default async function FlagshipCase() {
	const t = await getTranslations('home.flagship')

	return (
		<Section id="flagship-case" aria-labelledby="flagship-case-heading" tone="raised">
			<Container className={styles.inner}>
				<div className={styles.content}>
					<Eyebrow>{t('eyebrow')}</Eyebrow>
					<h2 id="flagship-case-heading" className={styles.title}>
						<span className={styles.titleWide}>{t('titleDesktop')}</span>
						<span className={styles.titleCompact}>{t('titleCompact')}</span>
					</h2>
					<p className={styles.summary}>{t('summary')}</p>
					<p className={styles.stack}>{flagshipWork.stack.join(' · ')}</p>
					<Button
						renders="link"
						href={flagshipWork.href}
						variant="primary"
						size="large"
						className={styles.cta}
					>
						{t('cta')}
						<ArrowRight className={styles.ctaIcon} aria-hidden="true" />
					</Button>
				</div>
				<div className={styles.systemMap} aria-hidden="true">
					{flagshipWork.systemNodeKeys.map((key) => (
						<div key={key} className={styles.systemNode}>
							<p className={styles.systemNodeLabel}>{t(`systemMap.${key}.label`)}</p>
							<p className={styles.systemNodeDescription}>{t(`systemMap.${key}.description`)}</p>
						</div>
					))}
				</div>
			</Container>
		</Section>
	)
}

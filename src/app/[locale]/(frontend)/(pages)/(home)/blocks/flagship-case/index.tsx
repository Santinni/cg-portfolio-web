import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'
import { flagshipWork } from '@/content/work'

import styles from './FlagshipCase.module.css'

/** Flagship case study — energy customer portal. */
export default async function FlagshipCase() {
	const t = await getTranslations('home.flagship')

	return (
		<Section
			id="flagship-case"
			aria-labelledby="flagship-case-heading"
			className={styles.section}
			tone="subtle"
		>
			<Container className={styles.inner}>
				<Eyebrow className={styles.eyebrow}>{t('eyebrow')}</Eyebrow>
				<h2 id="flagship-case-heading" className={styles.title}>
					<span id="flagship-title-desktop" className={styles.titleWide}>
						{t('titleDesktop')}
					</span>
					<span id="flagship-title-compact" className={styles.titleCompact}>
						{t('titleCompact')}
					</span>
				</h2>
				<div id="flagship-case-summary-row" className={styles.summaryRow}>
					<div id="flagship-case-content" className={styles.content}>
						<p id="flagship-case-summary" className={styles.summary}>
							<span id="flagship-summary-desktop" className={styles.summaryWide}>
								{t('summary')}
							</span>
							<span id="flagship-summary-compact" className={styles.summaryCompact}>
								{t('summaryCompact')}
							</span>
						</p>
						<p id="flagship-case-stack" className={styles.stack}>
							{flagshipWork.stack.join(' · ')}
						</p>
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
					<ul id="flagship-system-map" className={styles.systemMap}>
						<li className={styles.systemNode}>
							<p id="flagship-map-product-label" className={styles.systemProductLabel}>
								{t('systemMap.productUi.label')}
							</p>
							<p id="flagship-map-product-description" className={styles.systemProductDescription}>
								{t('systemMap.productUi.description')}
							</p>
						</li>
						<li className={styles.systemNode}>
							<p id="flagship-map-bridge" className={styles.systemBridge}>
								<span aria-hidden="true">↕</span>
								{t('systemMap.sharedComponents.label')}
								<span aria-hidden="true">↕</span>
							</p>
							<p id="flagship-map-foundations" className={styles.systemFoundations}>
								{t('systemMap.sharedComponents.description')}
							</p>
						</li>
					</ul>
				</div>
			</Container>
		</Section>
	)
}

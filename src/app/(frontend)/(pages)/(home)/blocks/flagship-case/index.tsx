import { ArrowRight } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/primitives/button'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'
import { flagshipWork } from '@/content/work'

import styles from './FlagshipCase.module.css'

/** Flagship case study — energy customer portal. */
export default function FlagshipCase() {
	return (
		<Section id="flagship-case" aria-labelledby="flagship-case-heading" tone="raised">
			<Container className={styles.inner}>
				<div className={styles.content}>
					<Eyebrow>{flagshipWork.eyebrow}</Eyebrow>
					<h2 id="flagship-case-heading" className={styles.title}>
						<span className={styles.titleWide}>{flagshipWork.titleDesktop}</span>
						<span className={styles.titleCompact}>{flagshipWork.titleCompact}</span>
					</h2>
					<p className={styles.summary}>{flagshipWork.summary}</p>
					<p className={styles.stack}>{flagshipWork.stack.join(' · ')}</p>
					<Button renders="link" href={flagshipWork.href} variant="primary">
						{flagshipWork.ctaLabel}
						<ArrowRight className={styles.ctaIcon} aria-hidden="true" />
					</Button>
				</div>
				<div className={styles.systemMap} aria-hidden="true">
					{flagshipWork.systemMap.map((node) => (
						<div key={node.label} className={styles.systemNode}>
							<p className={styles.systemNodeLabel}>{node.label}</p>
							<p className={styles.systemNodeDescription}>{node.description}</p>
						</div>
					))}
				</div>
			</Container>
		</Section>
	)
}

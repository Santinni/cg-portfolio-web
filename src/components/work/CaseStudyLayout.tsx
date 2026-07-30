import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { BookingCta } from '@/components/booking/BookingCta'
import { Eyebrow } from '@/components/site/Eyebrow'
import { caseStudySectionKeys, type CaseStudy } from '@/content/work'
import { Link } from '@/i18n/navigation'

import styles from './CaseStudyLayout.module.css'

interface CaseStudyLayoutProps {
	caseStudy: CaseStudy
	nextCase: CaseStudy
}

/** Shared semantic shell for the three launch case studies. */
export function CaseStudyLayout({ caseStudy, nextCase }: CaseStudyLayoutProps) {
	const t = useTranslations('work')
	const caseKey = caseStudy.key

	return (
		<article>
			<header className={styles.hero}>
				<Container className={styles.heroInner}>
					<div className={styles.heroCopy}>
						<Link href="/work" className={styles.backLink}>
							<ArrowLeft aria-hidden="true" />
							{t('navigation.allWork')}
						</Link>
						<Eyebrow>{t(`cases.${caseKey}.eyebrow`)}</Eyebrow>
						<h1 className={styles.title}>{t(`cases.${caseKey}.title`)}</h1>
						<p className={styles.description}>{t(`cases.${caseKey}.description`)}</p>
					</div>

					<dl className={styles.facts}>
						{caseStudy.hasRole && (
							<div className={styles.fact}>
								<dt>{t('facts.role')}</dt>
								<dd>{t(`cases.${caseKey}.role`)}</dd>
							</div>
						)}
						<div className={styles.fact}>
							<dt>{t('facts.focus')}</dt>
							<dd>{t(`cases.${caseKey}.focus`)}</dd>
						</div>
						<div className={styles.fact}>
							<dt>{t('facts.stack')}</dt>
							<dd>{caseStudy.stack.join(' · ')}</dd>
						</div>
					</dl>
				</Container>
			</header>

			<div className={styles.body}>
				<Container className={styles.sections}>
					{caseStudySectionKeys.map((sectionKey) => (
						<section key={sectionKey} className={styles.section}>
							<Eyebrow>{t(`cases.${caseKey}.sections.${sectionKey}.eyebrow`)}</Eyebrow>
							<div className={styles.sectionCopy}>
								<h2>{t(`cases.${caseKey}.sections.${sectionKey}.heading`)}</h2>
								<p>{t(`cases.${caseKey}.sections.${sectionKey}.body`)}</p>
							</div>
						</section>
					))}
				</Container>
			</div>

			<BookingCta source="caseStudy" />

			<nav className={styles.caseNavigation} aria-label={t('navigation.label')}>
				<Container className={styles.caseNavigationInner}>
					<Link href="/work" className={styles.navigationLink}>
						<ArrowLeft aria-hidden="true" />
						<span>
							<small>{t('navigation.backTo')}</small>
							{t('navigation.allWork')}
						</span>
					</Link>
					<Link
						href={`/work/${nextCase.slug}`}
						className={`${styles.navigationLink} ${styles.nextLink}`}
					>
						<span>
							<small>{t('navigation.nextCase')}</small>
							{t(`cases.${nextCase.key}.title`)}
						</span>
						<ArrowRight aria-hidden="true" />
					</Link>
				</Container>
			</nav>
		</article>
	)
}

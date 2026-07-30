import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import { WorkCard } from '@/components/work/WorkCard'
import { workItems } from '@/content/work'
import { createLocalizedMetadata } from '@/i18n/metadata'

import styles from './WorkPage.module.css'

interface WorkPageProps {
	params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'work.metadata' })

	return createLocalizedMetadata({
		locale,
		pathname: '/work',
		title: t('title'),
		description: t('description'),
		openGraphTitle: t('openGraphTitle'),
	})
}

export default async function WorkPage({ params }: WorkPageProps) {
	const { locale } = await params
	setRequestLocale(locale)
	const t = await getTranslations('work.hero')

	return (
		<>
			<header className={styles.hero}>
				<Container className={styles.heroInner}>
					<Eyebrow>{t('eyebrow')}</Eyebrow>
					<h1 className={styles.title}>{t('title')}</h1>
					<p className={styles.intro}>{t('intro')}</p>
				</Container>
			</header>

			<section className={styles.work} aria-labelledby="work-list-heading">
				<Container>
					<h2 id="work-list-heading" className={styles.visuallyHidden}>
						{t('listHeading')}
					</h2>
					<ul className={styles.grid}>
						{workItems.map((item) => (
							<li key={item.slug} className={styles.item}>
								<WorkCard item={item} />
							</li>
						))}
					</ul>
				</Container>
			</section>
		</>
	)
}

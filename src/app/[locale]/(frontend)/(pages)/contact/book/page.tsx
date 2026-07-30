import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { BookingScheduler } from '@/components/booking/BookingScheduler'
import { Eyebrow } from '@/components/site/Eyebrow'
import { PageIntro } from '@/components/site/PageIntro'
import { Section } from '@/components/site/Section'
import { bookingConfig } from '@/content/booking'
import { createLocalizedMetadata } from '@/i18n/metadata'
import { routing } from '@/i18n/routing'

import styles from './page.module.css'

interface BookingPageProps {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) notFound()

	const t = await getTranslations({ locale, namespace: 'booking.metadata' })

	return createLocalizedMetadata({
		locale,
		pathname: '/contact/book',
		title: t('title'),
		description: t('description'),
	})
}

/** Localized booking route with consent-gated Google Calendar scheduling. */
export default async function BookingPage({ params }: BookingPageProps) {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) notFound()

	setRequestLocale(locale)
	const t = await getTranslations('booking')

	return (
		<div className={styles.page} data-booking-page>
			<PageIntro eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

			<Section aria-labelledby="booking-offer-heading" tone="raised">
				<Container className={styles.layout}>
					<div className={styles.offer}>
						<Eyebrow>{t('offer.eyebrow')}</Eyebrow>
						<h2 id="booking-offer-heading" className={styles.heading}>
							{t('offer.title')}
						</h2>
						<p className={styles.body}>{t('offer.body')}</p>
					</div>

					<BookingScheduler
						scheduleUrl={bookingConfig.appointmentScheduleUrl}
						emailHref={bookingConfig.contact.emailHref}
						privacyText={t('embed.privacy')}
						loadLabel={t('embed.load')}
						loadingLabel={t('embed.loading')}
						iframeTitle={t('embed.iframeTitle')}
						fallbackTitle={t('fallbacks.title')}
						externalCalendarLabel={t('fallbacks.externalCalendar')}
						emailLabel={t('fallbacks.email')}
					/>
				</Container>
			</Section>
		</div>
	)
}

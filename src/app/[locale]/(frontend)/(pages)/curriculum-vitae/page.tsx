import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { DownloadAction } from '@/app/(frontend)/components/primitives/downloadAction'
import { ContactLink } from '@/components/site/ContactLink'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'
import { contactMethods } from '@/content/contact'
import {
	curriculumVitae,
	curriculumVitaeEarlierExperience,
	curriculumVitaeEducation,
	curriculumVitaeExperience,
	curriculumVitaeHighlights,
	type CurriculumVitaeLocale,
	curriculumVitaeLanguages,
	curriculumVitaeProjects,
	curriculumVitaeSkills,
} from '@/content/curriculum-vitae'
import { createLocalizedMetadata } from '@/i18n/metadata'
import { routing } from '@/i18n/routing'

import styles from './page.module.css'

/** The approved CV hero leads with location; `/contact` keeps the model order. */
const heroContactOrder = ['location', 'email', 'linkedin', 'github'] as const

interface CurriculumPageProps {
	params: Promise<{ locale: string }>
}

function formatMonth(value: string, locale: string) {
	const [year, month] = value.split('-').map(Number)

	return new Intl.DateTimeFormat(locale, {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(new Date(Date.UTC(year, month - 1, 1)))
}

export async function generateMetadata({ params }: CurriculumPageProps): Promise<Metadata> {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) notFound()

	const t = await getTranslations({ locale, namespace: 'curriculumVitae.metadata' })
	return createLocalizedMetadata({
		locale,
		pathname: '/curriculum-vitae',
		title: t('title'),
		description: t('description'),
	})
}

/** Localized, structured Curriculum Vitae page composed from the public CV fact model. */
export default async function CurriculumPage({ params }: CurriculumPageProps) {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) notFound()

	setRequestLocale(locale)
	const t = await getTranslations('curriculumVitae')
	const bookingT = await getTranslations('booking.entryPoints')
	const contactT = await getTranslations('contact.methods')
	const pdf = curriculumVitae.pdfByLocale[locale as CurriculumVitaeLocale]
	const downloadFilename = pdf.href.split('/').at(-1)

	return (
		<article className={styles.page} data-cv-content data-locale={locale}>
			<header className={styles.hero}>
				<Container className={styles.heroInner}>
					<Eyebrow className={styles.eyebrowAccent}>{t('hero.eyebrow')}</Eyebrow>
					<h1 className={styles.name}>{curriculumVitae.person.name}</h1>
					<p className={styles.role}>{t('hero.role')}</p>
					<p className={styles.heroIntro}>{t('hero.intro')}</p>

					<address className={styles.contactList}>
						{heroContactOrder.map((key) => {
							const method = contactMethods.find((entry) => entry.key === key)
							if (!method) return null

							return (
								<ContactLink
									key={key}
									method={{
										...method,
										label: contactT(`${key}.label`),
										value: key === 'location' ? contactT('location.value') : method.value,
									}}
									variant="inline"
								/>
							)
						})}
					</address>

					<div className={styles.heroActions} data-booking-source="curriculumVitae">
						<DownloadAction
							href={pdf.href}
							label={t('download.label')}
							accessibilityLabel={t('download.accessibilityLabel')}
							downloadFilename={downloadFilename}
							mode="expanded"
						/>
						<Button renders="link" href="/contact/book" size="large" variant="secondary">
							{bookingT('curriculumVitae.action')}
						</Button>
					</div>
				</Container>
			</header>

			<Section id="cv-profile" aria-labelledby="cv-profile-heading" tone="subtle">
				<Container>
					<div className={styles.sectionHeading}>
						<Eyebrow className={styles.eyebrowAccent}>{t('highlights.eyebrow')}</Eyebrow>
						<h2 id="cv-profile-heading">{t('highlights.title')}</h2>
					</div>
					<ul className={styles.highlightGrid}>
						{curriculumVitaeHighlights.map(({ id }) => (
							<li className={styles.highlightCard} key={id}>
								<h3>{t(`highlights.entries.${id}.title`)}</h3>
								<p>{t(`highlights.entries.${id}.description`)}</p>
							</li>
						))}
					</ul>
				</Container>
			</Section>

			<Section id="cv-skills" aria-labelledby="cv-skills-heading" tone="page">
				<Container>
					<div className={styles.sectionHeading}>
						<Eyebrow className={styles.eyebrowAccent}>{t('skills.eyebrow')}</Eyebrow>
						<h2 id="cv-skills-heading">{t('skills.title')}</h2>
					</div>
					<ul className={styles.skillList}>
						{curriculumVitaeSkills.map(({ id }) => (
							<li className={styles.skillRow} key={id}>
								<h3>{t(`skills.entries.${id}.title`)}</h3>
								<p>{t(`skills.entries.${id}.description`)}</p>
							</li>
						))}
					</ul>
				</Container>
			</Section>

			<Section id="cv-experience" aria-labelledby="cv-experience-heading" tone="raised">
				<Container>
					<div className={styles.sectionHeading}>
						<Eyebrow className={styles.eyebrowAccent}>{t('experience.eyebrow')}</Eyebrow>
						<h2 id="cv-experience-heading">{t('experience.title')}</h2>
						<p className={styles.sectionIntro}>{t('experience.intro')}</p>
					</div>
					<ol className={styles.timeline}>
						{curriculumVitaeExperience.map((experience) => {
							const isCurrent = experience.end === null

							return (
								<li
									className={styles.timelineEntry}
									data-current-role={isCurrent || undefined}
									key={experience.id}
								>
									<p className={styles.timelinePeriod}>
										<time dateTime={experience.start}>{formatMonth(experience.start, locale)}</time>
										<span aria-hidden="true"> – </span>
										{experience.end ? (
											<time dateTime={experience.end}>{formatMonth(experience.end, locale)}</time>
										) : (
											<span>{t('experience.presentLabel')}</span>
										)}
									</p>
									<div className={styles.timelineContent}>
										<div className={styles.timelineTitleRow}>
											<h3>
												{t(`experience.entries.${experience.id}.title`)}
												<span aria-hidden="true"> · </span>
												{experience.company}
											</h3>
											{isCurrent ? (
												<span className={styles.currentRole}>{t('accessibility.currentRole')}</span>
											) : null}
										</div>
										<p className={styles.summary}>
											{t(`experience.entries.${experience.id}.summary`)}
										</p>
									</div>
								</li>
							)
						})}
					</ol>
					<div className={styles.earlierExperience}>
						<h3 className={styles.earlierExperienceTitle}>
							{t('experience.earlierExperience.title')}
						</h3>
						<ul className={styles.earlierExperienceList}>
							{curriculumVitaeEarlierExperience.map((entry) => (
								<li key={entry.id}>
									<p className={styles.earlierExperiencePeriod}>
										<time dateTime={entry.start}>{entry.start}</time>
										<span aria-hidden="true"> – </span>
										<time dateTime={entry.end}>{entry.end}</time>
									</p>
									<p>
										<span className={styles.earlierExperienceRole}>
											{t(`experience.earlierExperience.entries.${entry.id}.title`)}
											<span aria-hidden="true"> · </span>
											{entry.company}
										</span>
										<span className={styles.earlierExperienceSummary}>
											{t(`experience.earlierExperience.entries.${entry.id}.summary`)}
										</span>
									</p>
								</li>
							))}
						</ul>
					</div>
				</Container>
			</Section>

			<Section id="cv-projects" aria-labelledby="cv-projects-heading" tone="page">
				<Container>
					<div className={styles.sectionHeading}>
						<Eyebrow className={styles.eyebrowAccent}>{t('projects.eyebrow')}</Eyebrow>
						<h2 id="cv-projects-heading">{t('projects.title')}</h2>
					</div>
					<ul className={styles.projectGrid}>
						{curriculumVitaeProjects.map(({ id, experienceId }) => {
							const experience = curriculumVitaeExperience.find((item) => item.id === experienceId)

							return (
								<li className={styles.projectCard} key={id}>
									{experience ? (
										<p className={styles.projectCompany}>{experience.company}</p>
									) : null}
									<h3>{t(`projects.entries.${id}.title`)}</h3>
									<p>{t(`projects.entries.${id}.description`)}</p>
								</li>
							)
						})}
					</ul>
				</Container>
			</Section>

			<Section id="cv-education" aria-labelledby="cv-education-heading" tone="raised">
				<Container>
					<div className={styles.sectionHeading}>
						<Eyebrow className={styles.eyebrowAccent}>{t('education.eyebrow')}</Eyebrow>
						<h2 id="cv-education-heading">{t('education.title')}</h2>
					</div>
					<div className={styles.educationLayout}>
						<ul className={styles.educationList}>
							{curriculumVitaeEducation.map((education) => (
								<li className={styles.educationEntry} key={education.id}>
									<p className={styles.period}>
										<time dateTime={education.start}>{education.start}</time>
										<span aria-hidden="true"> – </span>
										{education.end ? (
											<time dateTime={education.end}>{education.end}</time>
										) : (
											<span>{t('education.ongoingLabel')}</span>
										)}
									</p>
									<h3>{education.institution}</h3>
									<p>{t(`education.entries.${education.id}.degree`)}</p>
								</li>
							))}
						</ul>
						<div className={styles.languages}>
							<h3>{t('education.languagesTitle')}</h3>
							<ul>
								{curriculumVitaeLanguages.map(({ id }) => (
									<li key={id}>
										<span>{t(`education.languages.${id}.name`)}</span>
										<span>{t(`education.languages.${id}.level`)}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</Container>
			</Section>

			<section id="cv-download" className={styles.downloadSection}>
				<Container className={styles.downloadInner}>
					<div>
						<Eyebrow className={styles.downloadEyebrow}>
							{t('download.languageLabel')} · {t('download.profileLabel')}
						</Eyebrow>
						<h2>{t('download.label')}</h2>
						<p>{t('download.description')}</p>
					</div>
					<div className={styles.footerDownload} data-cv-download="footer">
						<DownloadAction
							href={pdf.href}
							label={t('download.label')}
							accessibilityLabel={t('download.accessibilityLabel')}
							downloadFilename={downloadFilename}
							mode="expanded"
						/>
					</div>
				</Container>
			</section>

			<div className={styles.floatingDownload} data-cv-download="floating">
				<DownloadAction
					href={pdf.href}
					label={t('download.label')}
					accessibilityLabel={t('download.accessibilityLabel')}
					downloadFilename={downloadFilename}
				/>
			</div>
		</article>
	)
}

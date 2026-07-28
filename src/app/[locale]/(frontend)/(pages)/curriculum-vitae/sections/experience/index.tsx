import { useTranslations } from 'next-intl'

import styles from './Experience.module.css'

/** Work experience timeline from newest to oldest position. */
export const Experience = () => {
	const t = useTranslations('curriculumVitae.experience')
	const experiences = [
		{
			period: t('presentPeriod'),
			title: t('entries.kontentAi.title'),
			company: t('freelancerAt', { company: 'Kontent.ai' }),
			description: [
				t('entries.kontentAi.descriptions.accessibilityProject'),
				t('entries.kontentAi.descriptions.reactAria'),
				t('entries.kontentAi.descriptions.responsibilities'),
				t('entries.kontentAi.descriptions.outcome'),
			],
		},
		{
			period: '4/2024 – 9/2024',
			title: t('entries.tldrit.title'),
			company: t('freelancerAt', { company: 'TLDR;IT s.r.o.' }),
			description: [
				t('entries.tldrit.descriptions.leadership'),
				t('entries.tldrit.descriptions.delivery'),
			],
		},
		{
			period: '9/2021 – 4/2024',
			title: t('entries.eman.title'),
			company: 'eMan a.s.',
			description: [
				t('entries.eman.descriptions.clients'),
				t('entries.eman.descriptions.optimization'),
				t('entries.eman.descriptions.refactoring'),
				t('entries.eman.descriptions.collaboration'),
			],
		},
		{
			period: '9/2020 – 9/2021',
			title: t('entries.lmc.title'),
			company: 'LMC',
			description: [
				t('entries.lmc.descriptions.solutions'),
				t('entries.lmc.descriptions.discovery'),
				t('entries.lmc.descriptions.technology'),
				t('entries.lmc.descriptions.accessibility'),
			],
		},
		{
			period: '9/2019 – 9/2020',
			title: t('entries.ampX.title'),
			company: 'Amp X',
			description: [
				t('entries.ampX.descriptions.platform'),
				t('entries.ampX.descriptions.quality'),
				t('entries.ampX.descriptions.technology'),
			],
		},
		{
			period: '4/2019 – 9/2019',
			title: t('entries.skype.title'),
			company: 'Skype.com',
			description: [
				t('entries.skype.descriptions.scale'),
				t('entries.skype.descriptions.quality'),
				t('entries.skype.descriptions.components'),
				t('entries.skype.descriptions.cms'),
			],
		},
		{
			period: '6/2018 – 3/2019',
			title: t('entries.foxconn.title'),
			company: 'Foxconn DRC s.r.o.',
			description: [
				t('entries.foxconn.descriptions.gui'),
				t('entries.foxconn.descriptions.collaboration'),
				t('entries.foxconn.descriptions.technology'),
				t('entries.foxconn.descriptions.designSystem'),
			],
		},
		{
			period: '5/2017 – 5/2018',
			title: t('entries.mountfield.title'),
			company: 'Mountfield, a.s.',
			description: [
				t('entries.mountfield.descriptions.website'),
				t('entries.mountfield.descriptions.microsites'),
				t('entries.mountfield.descriptions.internalApps'),
			],
		},
		{
			period: '08/2014 – 5/2017',
			title: t('entries.bitware.title'),
			company: 'BitWare CZ s.r.o.',
			description: [
				t('entries.bitware.descriptions.scope'),
				t('entries.bitware.descriptions.presentations'),
				t('entries.bitware.descriptions.wordpress'),
			],
		},
	]

	return (
		<section className={styles.experience} aria-labelledby="experience-heading">
			<h2 id="experience-heading" className={styles.sectionTitle}>
				{t('title')}
			</h2>
			<div className={styles.timeline}>
				{experiences.map((experience) => (
					<div key={experience.company} className={styles.timelineItem}>
						<div className={styles.timelinePeriod}>{experience.period}</div>
						<div className={styles.timelineContent}>
							<h3 className={styles.timelineTitle}>
								{experience.title}
								<span className={styles.timelineCompany}>{experience.company}</span>
							</h3>
							<ul className={styles.timelineDescription}>
								{experience.description.map((description) => (
									<li key={description.slice(0, 40)}>{description}</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

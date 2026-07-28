import { useTranslations } from 'next-intl'

import styles from './Education.module.css'

/** Education section — lists formal education and completed courses. */
export const Education = () => {
	const t = useTranslations('curriculumVitae.education')
	const educationItems = [
		{
			period: '2002-2006',
			institution: 'COPTH, Poděbradská 1/179',
			degree: t('degree'),
		},
	]
	const courses = [
		{
			year: '2018',
			name: 'VzhuruDolu.cz',
			description: t('courses.vzhuruDolu'),
		},
		{
			year: '2018',
			name: 'Learn2code.cz',
			description: t('courses.learn2code'),
		},
		{
			year: '2016',
			name: t('courses.webrebel'),
		},
		{
			year: '2016-2018',
			name: 'Free Code Camp',
			description: t('courses.freeCodeCamp'),
		},
		{
			year: '2015',
			name: 'Codecademy',
			description: t('courses.codecademy'),
		},
		{
			year: '2015',
			name: 'S - COMP Centre CZ s.r.o., Ohradní 1079/59',
			description: t('courses.scomp'),
		},
	]

	return (
		<section className={styles.education} aria-labelledby="education-heading">
			<h2 id="education-heading" className={styles.sectionTitle}>
				{t('title')}
			</h2>
			<div className={styles.educationList}>
				{educationItems.map((item) => (
					<div key={item.institution} className={styles.educationItem}>
						<div className={styles.period}>{item.period}</div>
						<div className={styles.details}>
							<h3 className={styles.institution}>{item.institution}</h3>
							<p className={styles.degree}>{item.degree}</p>
						</div>
					</div>
				))}
			</div>

			<h3 className={styles.coursesTitle}>{t('coursesTitle')}</h3>
			<div className={styles.coursesList}>
				{courses.map((course) => (
					<div key={`${course.year}-${course.name}`} className={styles.courseItem}>
						<div className={styles.courseYear}>{course.year}</div>
						<div className={styles.courseDetails}>
							<h4 className={styles.courseName}>{course.name}</h4>
							{course.description ? (
								<p className={styles.courseDescription}>{course.description}</p>
							) : null}
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

import { LinkedInIcon } from '@/app/(frontend)/components/icons/BrandIcons'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'

import styles from './Contact.module.css'

/** CV contact info strip with phone, email, LinkedIn and location. */
export const Contact = () => {
	const t = useTranslations('curriculumVitae.contact')

	return (
		<div className={styles.contact}>
			<div className={styles.contactItem}>
				<a href="tel:+420605570494" className={styles.contactLink}>
					<Phone className={styles.icon} aria-hidden="true" />
					+420 605 570 494
				</a>
			</div>
			<div className={styles.contactItem}>
				<a href="mailto:karel.kutchan@email.cz" className={styles.contactLink}>
					<Mail className={styles.icon} aria-hidden="true" />
					karel.kutchan@email.cz
				</a>
			</div>
			<div className={styles.contactItem}>
				<a
					href="https://www.linkedin.com/in/karelkutchan/"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.contactLink}
				>
					<LinkedInIcon className={styles.icon} />
					{t('linkedin')}
				</a>
			</div>
			<div className={styles.contactItem}>
				<MapPin className={styles.icon} aria-hidden="true" />
				<span>{t('location')}</span>
			</div>
		</div>
	)
}

import { GithubIcon, LinkedinIcon } from 'lucide-react'

import BookingModal from '@/app/(frontend)/components/ui/bookingModal'
import type { Contact as ContactType } from '@/payload-types'

import styles from './Contact.module.css'

/** Props for the {@link Contact} section. */
interface ContactProps {
	data: ContactType
}

/**
 * Contact section — displays email, phone, social links
 * fetched from the CMS, plus a Google Calendar booking modal.
 */
export default function Contact({ data }: ContactProps) {
	return (
		<section className={styles.section} id="contact" aria-labelledby="contact-heading">
			<div className={styles.container}>
				<h2 id="contact-heading" className={styles.title}>
					{data.title}
				</h2>
				<p className={styles.subtitle}>{data.description}</p>
				<div className={styles.content}>
					<div className={styles.linkWrapper}>
						<a className={styles.contactItem} href={`mailto:${data.email}`}>
							{data.email}
						</a>
						{data.phone && (
							<a className={styles.contactItem} href={`tel:${data.phone}`}>
								{data.phone}
							</a>
						)}
					</div>
					<div className={styles.linkWrapper}>
						{data.linkedin && (
							<a
								className={styles.contactItem}
								href={data.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn profile"
							>
								<LinkedinIcon />
							</a>
						)}
						{data.github && (
							<a
								className={styles.contactItem}
								href={data.github}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub profile"
							>
								<GithubIcon />
							</a>
						)}
					</div>
					<BookingModal />
				</div>
			</div>
		</section>
	)
}

import type { Metadata } from 'next'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { ContactLink } from '@/components/site/ContactLink'
import { Eyebrow } from '@/components/site/Eyebrow'
import { PageIntro } from '@/components/site/PageIntro'
import { Section } from '@/components/site/Section'
import { contactPage } from '@/content/contact'

import styles from './page.module.css'

export const metadata: Metadata = {
	title: 'Contact',
	description:
		'Contact Karel Kutchan about senior or lead frontend roles and selected consulting conversations.',
	alternates: { canonical: '/contact' },
}

export default function ContactPage() {
	return (
		<>
			<PageIntro
				eyebrow={contactPage.eyebrow}
				title={contactPage.title}
				intro={contactPage.intro}
			/>

			<Section aria-labelledby="contact-methods-heading" tone="raised">
				<Container className={styles.layout}>
					<div className={styles.sectionHeading}>
						<Eyebrow>CONTACT DETAILS</Eyebrow>
						<h2 id="contact-methods-heading" className={styles.heading}>
							Choose the most useful channel.
						</h2>
					</div>
					<div className={styles.methods}>
						{contactPage.methods.map((method) => (
							<ContactLink method={method} key={method.label} />
						))}
					</div>
				</Container>
			</Section>

			<Section aria-labelledby="contact-expectations-heading" tone="page">
				<Container className={styles.expectations}>
					<Eyebrow>BEFORE WE TALK</Eyebrow>
					<h2 id="contact-expectations-heading" className={styles.heading}>
						{contactPage.expectations.title}
					</h2>
					<p>{contactPage.expectations.body}</p>
				</Container>
			</Section>
		</>
	)
}

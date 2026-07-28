import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'
import { PageIntro } from '@/components/site/PageIntro'
import { Section } from '@/components/site/Section'

import styles from './page.module.css'

export const metadata: Metadata = {
	title: 'About',
	description:
		'About Karel Kutchan, a Prague-based senior frontend engineer focused on product delivery, architecture and team clarity.',
	alternates: { canonical: '/about' },
}

const values = [
	{
		title: 'Ownership',
		description: 'I take responsibility for decisions and their downstream cost.',
	},
	{
		title: 'Clarity',
		description: 'Trade-offs should be visible to engineers and product partners.',
	},
	{
		title: 'Craft',
		description: 'Accessibility, tests and maintainability belong in normal delivery.',
	},
] as const

export default function AboutPage() {
	return (
		<>
			<PageIntro
				eyebrow="ABOUT"
				title="I care about the system behind the interface."
				intro="I am a Prague-based senior frontend engineer with more than ten years in web development. I currently work in a lead frontend role, helping teams turn product requirements into maintainable systems."
			/>

			<Section aria-labelledby="working-style-heading" tone="raised">
				<Container className={styles.workingStyle}>
					<div className={styles.sectionHeading}>
						<Eyebrow>WORKING STYLE</Eyebrow>
						<h2 id="working-style-heading" className={styles.heading}>
							Practical, direct and product-minded.
						</h2>
					</div>
					<p className={styles.bodyCopy}>
						My strongest work sits where product delivery, frontend architecture and team clarity
						meet. I ask what must stay flexible, what must be consistent and where complexity is
						actually justified.
					</p>
				</Container>
			</Section>

			<Section aria-labelledby="values-heading" tone="page">
				<Container>
					<div className={styles.sectionHeading}>
						<Eyebrow>VALUES</Eyebrow>
						<h2 id="values-heading" className={styles.heading}>
							How I approach the work.
						</h2>
					</div>
					<ul className={styles.values}>
						{values.map((value) => (
							<li className={styles.value} key={value.title}>
								<h3>{value.title}</h3>
								<p>{value.description}</p>
							</li>
						))}
					</ul>
				</Container>
			</Section>

			<Section aria-labelledby="about-cta-heading" tone="contrast">
				<Container className={styles.cta}>
					<h2 id="about-cta-heading" className={styles.ctaHeading}>
						See the work behind the profile.
					</h2>
					<Button renders="link" href="/work" variant="primary">
						View selected work
						<ArrowRight className={styles.icon} aria-hidden="true" />
					</Button>
				</Container>
			</Section>
		</>
	)
}

import type { Service } from '@/payload-types'

import styles from './Services.module.css'

/** Props for the {@link Services} section. */
interface ServicesProps {
	data: Service[]
}

/**
 * Services section — renders a grid of service cards
 * sourced from the CMS Services collection.
 */
export default function Services({ data }: ServicesProps) {
	return (
		<section className={styles.section} id="services" aria-labelledby="services-heading">
			<div className={styles.container}>
				<h2 id="services-heading" className={styles.title}>
					How may I help you?
				</h2>
				<p className={styles.subtitle}>Together, we can turn your visions into reality.</p>
				<div className={styles.grid}>
					{data.map((service) => (
						<div key={service.id} className={styles.card}>
							<div className={styles.icon}>{service.icon}</div>
							<h3 className={styles.cardTitle}>{service.title}</h3>
							<p className={styles.description}>{service.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

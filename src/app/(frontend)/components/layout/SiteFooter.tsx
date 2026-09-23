import { getTranslations } from 'next-intl/server'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { ContactLink } from '@/components/site/ContactLink'
import { contactMethods } from '@/content/contact'
import { homeLinks } from '@/content/profile'
import { siteConfig } from '@/content/site'
import { Link } from '@/i18n/navigation'

import styles from './SiteFooter.module.css'

/**
 * Site footer (COD-91, SC-01): the one global entry to contact, the CV and the booking
 * page, so no route is a dead end for a recruiter. Three columns from 768px (brand |
 * contact | next step), stacked below; a copyright row underneath.
 *
 * It is the page's single `contentinfo` landmark and deliberately contains no `section`
 * elements: the Home accessibility contract counts named regions page-wide, and the
 * footer's two column headings are enough structure for assistive technology.
 *
 * Contact rows are `ContactLink` in its `list` variant (CV-05): the e-mail keeps its
 * `mailto:` in the same tab, the profiles open in a new tab with `rel`, and the
 * non-interactive location is not listed here — it closes the meta row instead.
 */
export async function SiteFooter() {
	const t = await getTranslations('footer')
	const tMethods = await getTranslations('contact.methods')
	const tIdentity = await getTranslations('home.hero.identity')
	const name = tIdentity('name')
	const methods = contactMethods
		.filter((method) => method.href)
		.map((method) => ({ ...method, label: tMethods(`${method.key}.label`) }))

	return (
		<footer className={styles.footer} data-site-footer>
			<Container className={styles.inner}>
				<div className={styles.columns}>
					<div className={styles.brand}>
						<p className={styles.wordmark}>{siteConfig.brand}</p>
						<p className={styles.name}>{name}</p>
						<p className={styles.role}>{t('role')}</p>
					</div>
					<div className={styles.column}>
						<h2 className={styles.eyebrow}>{t('contactEyebrow')}</h2>
						<ul className={styles.list}>
							{methods.map((method) => (
								<li key={method.key}>
									<ContactLink method={method} variant="list" />
								</li>
							))}
						</ul>
					</div>
					<div className={styles.column}>
						<h2 className={styles.eyebrow}>{t('nextEyebrow')}</h2>
						<ul className={styles.list}>
							<li>
								<Link href="/curriculum-vitae" className={styles.link}>
									{t('links.curriculumVitae')}
								</Link>
							</li>
							<li>
								<Link href={homeLinks.booking} className={styles.link}>
									{t('links.booking')}
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className={styles.meta}>
					<p className={styles.metaText}>
						{t('copyright', { year: new Date().getFullYear(), name })}
					</p>
					<p className={styles.metaText}>{tMethods('location.value')}</p>
				</div>
			</Container>
		</footer>
	)
}

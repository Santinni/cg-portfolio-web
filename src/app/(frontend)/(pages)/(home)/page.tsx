import About from '@/app/(frontend)/(pages)/(home)/sections/about'
import Contact from '@/app/(frontend)/(pages)/(home)/sections/contact'
import Hero from '@/app/(frontend)/(pages)/(home)/sections/hero'
import Services from '@/app/(frontend)/(pages)/(home)/sections/services'
import { getHomePageData } from '@/lib/api/getHomePageData'

/** Revalidate home page data every 60 seconds */
export const revalidate = 60

/**
 * Home page — server component that fetches CMS data and
 * composes the Hero, Services, About and Contact sections.
 */
export default async function HomePage() {
	const { services, about, contact } = await getHomePageData()

	return (
		<>
			<Hero />
			<Services data={services} />
			<About data={about} />
			<Contact data={contact} />
		</>
	)
}

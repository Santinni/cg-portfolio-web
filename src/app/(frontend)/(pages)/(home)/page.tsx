import About from '@/app/(frontend)/(pages)/(home)/sections/about'
import Contact from '@/app/(frontend)/(pages)/(home)/sections/contact'
import Hero from '@/app/(frontend)/(pages)/(home)/sections/hero'
import Services from '@/app/(frontend)/(pages)/(home)/sections/services'
import { getHomePageData } from '@/lib/api/getHomePageData'

export const dynamic = 'force-dynamic'

/**
 * Legacy home page fallback. The final public route will be rebuilt from the
 * approved Figma design, while this page keeps current CMS content available.
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

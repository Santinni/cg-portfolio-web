import ExperienceSnapshot from '@/app/(frontend)/(pages)/(home)/blocks/experience-snapshot'
import FinalCta from '@/app/(frontend)/(pages)/(home)/blocks/final-cta'
import FlagshipCase from '@/app/(frontend)/(pages)/(home)/blocks/flagship-case'
import Hero from '@/app/(frontend)/(pages)/(home)/blocks/hero'
import Principles from '@/app/(frontend)/(pages)/(home)/blocks/principles'
import SelectedWork from '@/app/(frontend)/(pages)/(home)/blocks/selected-work'

/**
 * Home — the public landing page. Renders entirely from typed local content
 * so it stays available independent of Payload/PostgreSQL.
 */
export default function HomePage() {
	return (
		<>
			<Hero />
			<FlagshipCase />
			<SelectedWork />
			<Principles />
			<ExperienceSnapshot />
			<FinalCta />
		</>
	)
}

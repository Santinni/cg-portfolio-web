import About from "@/app/(frontend)/(pages)/(home)/sections/about";
import Contact from "@/app/(frontend)/(pages)/(home)/sections/contact";
import Hero from "@/app/(frontend)/(pages)/(home)/sections/hero";
import Projects from "@/app/(frontend)/(pages)/(home)/sections/projects";
import Services from "@/app/(frontend)/(pages)/(home)/sections/services";
import { getHomePageDataCached } from "@/lib/api/getHomePageData";

export default async function Home() {
  const { services, projects, about, contact } = await getHomePageDataCached();

  return (
    <>
      <Hero />
      <Services data={services} />
      <Projects data={projects} />
      <About data={about} />
      <Contact data={contact} />
    </>
  );
}

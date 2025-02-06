import About from "@/app/(frontend)/(pages)/(home)/sections/about";
import Contact from "@/app/(frontend)/(pages)/(home)/sections/contact";
import Hero from "@/app/(frontend)/(pages)/(home)/sections/hero";
import Projects from "@/app/(frontend)/(pages)/(home)/sections/projects";
import Services from "@/app/(frontend)/(pages)/(home)/sections/services";
import { getHomePageDataCached } from "@/lib/api/getHomePageData";
import type {
  About as AboutType,
  Contact as ContactType,
} from "@/payload-types";

export default async function HomePage() {
  // Během buildu vrátíme prázdná data
  if (process.env.NODE_ENV === "production" && !process.env.PAYLOAD_SECRET) {
    const emptyAbout: AboutType = {
      id: 1,
      title: "About",
      content: {
        root: {
          type: "root",
          children: [{ type: "paragraph", version: 1 }],
          direction: null,
          format: "",
          indent: 0,
          version: 1,
        },
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const emptyContact: ContactType = {
      id: 1,
      title: "Contact",
      description: "Contact information",
      email: "placeholder@example.com",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    return (
      <>
        <Hero />
        <Services data={[]} />
        <Projects data={[]} />
        <About data={emptyAbout} />
        <Contact data={emptyContact} />
      </>
    );
  }

  // V runtime načteme data normálně
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

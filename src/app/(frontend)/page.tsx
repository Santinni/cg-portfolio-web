import Hero from "@/components/hero/Hero";
import Services from "@/components/services/Services";
import Projects from "@/components/projects/Projects";
import About from "@/components/about/About";
import Contact from "@/components/contact/Contact";
import { getPayloadClient } from "@/payload/payloadClient";
import { unstable_cache } from "next/cache";
import { AboutType, ProjectType, ServiceType, ContactType } from "@/types";

const getPageDataCached = unstable_cache(
  async () => {
    const payload = await getPayloadClient();

    const [services, projects, about, contact] = await Promise.all([
      payload.find({
        collection: "services",
        depth: 1,
      }),
      payload.find({
        collection: "projects",
        depth: 1,
      }),
      payload.find({
        collection: "about",
        depth: 1,
      }),
      payload.find({
        collection: "contact",
        depth: 1,
      }),
    ]);

    return {
      services: services.docs as ServiceType[],
      projects: projects.docs as ProjectType[],
      about: about.docs[0] as AboutType,
      contact: contact.docs[0] as ContactType,
    };
  },
  ["page-data"],
  {
    tags: ["services", "projects", "about", "contact"],
    revalidate: 60,
  }
);

export default async function Home() {
  const { services, projects, about, contact } = await getPageDataCached();

  return (
    <main>
      <Hero />
      <Services services={services} />
      <Projects projects={projects} />
      <About data={about} />
      <Contact data={contact} />
    </main>
  );
}

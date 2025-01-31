import { unstable_cache } from 'next/cache';

import {
  About,
  Contact,
  Project,
  Service,
} from '@/payload-types';
import { getPayloadClient } from '@/payload/payloadClient';

export const getHomePageDataCached = unstable_cache(
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
      services: services.docs as Service[],
      projects: projects.docs as Project[],
      about: about.docs[0] as About,
      contact: contact.docs[0] as Contact,
    };
  },
  ["page-data"],
  {
    tags: ["services", "projects", "about", "contact"],
    revalidate: 60,
  }
);

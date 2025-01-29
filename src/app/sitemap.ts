import { MetadataRoute } from 'next';

import { getPayloadClient } from '@/payload/payloadClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://codeguy.cz'

  // Základní statické stránky
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/curriculum-vitae`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ] as const

  // Získání dynamického obsahu z Payload CMS
  const payload = await getPayloadClient()

  // Získání projektů
  const projects = await payload.find({
    collection: 'projects',
  })

  const projectPages = projects.docs.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...projectPages]
}
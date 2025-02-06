import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://codeguy.cz'

  // Basic static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/curriculum-vitae`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic content only if we are in production
  // if (process.env.PAYLOAD_SECRET) {
  //   try {
  //     const { getPayloadClient } = await import('@/payload/payloadClient')
  //     const payload = await getPayloadClient()
  //     const projects = await payload.find({
  //       collection: 'projects',
  //     })

  //     const projectPages = projects.docs.map((project) => ({
  //       url: `${baseUrl}/projects/${project.id}`,
  //       lastModified: new Date(project.updatedAt),
  //       changeFrequency: 'monthly' as const,
  //       priority: 0.6,
  //     }))

  //     return [...staticPages, ...projectPages]
  //   } catch (error) {
  //     console.error('Failed to fetch dynamic sitemap content:', error)
  //   }
  // }

  return staticPages
}
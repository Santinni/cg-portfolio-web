import { getPayload } from 'payload'

import config from '../../payload.config'
import {
  buildPublishedPostWhere,
  mapPublicAuthor,
  mapPublicPost,
  mapPublicTopic,
  normalizePagination,
  type PublicAuthor,
  type PublicPost,
  type PublicTopic,
} from './publicContent'

const getPublicPayload = () => getPayload({ config })

export const getPublishedPostBySlug = async (slug: string): Promise<PublicPost | null> => {
  const payload = await getPublicPayload()
  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: buildPublishedPostWhere({ slug }),
  })

  return result.docs[0] ? mapPublicPost(result.docs[0]) : null
}

export const listPublishedPosts = async ({
  limit,
  page,
  topicSlug,
}: {
  limit?: number
  page?: number
  topicSlug?: string
} = {}) => {
  const payload = await getPublicPayload()
  const pagination = normalizePagination({ limit, page })
  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    draft: false,
    limit: pagination.limit,
    overrideAccess: false,
    page: pagination.page,
    sort: '-publishedAt',
    where: buildPublishedPostWhere({ excludeNoIndex: true, topicSlug }),
  })

  return { ...result, docs: result.docs.map(mapPublicPost).filter((post): post is PublicPost => post !== null) }
}

export const listPublicTopics = async (): Promise<PublicTopic[]> => {
  const payload = await getPublicPayload()
  const result = await payload.find({
    collection: 'topics',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'order',
  })
  return result.docs.map(mapPublicTopic).filter((topic): topic is PublicTopic => topic !== null)
}

export const getPublicAuthorByID = async (id: number): Promise<PublicAuthor | null> => {
  const payload = await getPublicPayload()
  const result = await payload.find({
    collection: 'authors',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { id: { equals: id } },
  })
  return result.docs[0] ? mapPublicAuthor(result.docs[0]) : null
}

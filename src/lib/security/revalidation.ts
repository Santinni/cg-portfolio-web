import { createHmac, timingSafeEqual } from 'node:crypto'

const MAX_AGE_MS = 300_000
const COLLECTIONS = ['authors', 'media', 'posts', 'topics'] as const
const OPERATIONS = ['delete', 'publish', 'unpublish', 'update'] as const
const TAG_PREFIX = {
  authors: 'author',
  media: 'media',
  posts: 'post',
  topics: 'topic',
} as const

export type RevalidationEvent = {
  collection: (typeof COLLECTIONS)[number]
  documentID: number | string
  operation: (typeof OPERATIONS)[number]
  previousSlug?: string
  slug?: string
}

type SignedPayload = { deliveryID: string; event: RevalidationEvent; timestamp: number }

const sign = (body: string, timestamp: string, secret: string): Buffer =>
  createHmac('sha256', secret).update(`${timestamp}.${body}`, 'utf8').digest()

const isSlug = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value)

const isID = (value: unknown): value is number | string =>
  (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) ||
  (typeof value === 'string' && /^[A-Za-z0-9_-]{1,128}$/u.test(value))

const isEvent = (value: unknown): value is RevalidationEvent => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const event = value as Record<string, unknown>
  if (Object.keys(event).some((key) => !['collection', 'documentID', 'operation', 'previousSlug', 'slug'].includes(key))) return false
  if (!COLLECTIONS.includes(event.collection as RevalidationEvent['collection'])) return false
  if (!OPERATIONS.includes(event.operation as RevalidationEvent['operation']) || !isID(event.documentID)) return false
  if (event.slug !== undefined && !isSlug(event.slug)) return false
  if (event.previousSlug !== undefined && !isSlug(event.previousSlug)) return false
  return true
}

const assertEvent = (event: RevalidationEvent): void => {
  if (!isEvent(event)) throw new Error('Invalid revalidation event.')
}

const assertSecret = (secret: string): void => {
  if (secret.length < 32) throw new Error('Revalidation signing secret must contain at least 32 characters.')
}

export const getRevalidationTargets = (event: RevalidationEvent): { paths: string[]; tags: string[] } => {
  assertEvent(event)
  const id = String(event.documentID)
  if (event.collection === 'posts') {
    const paths = ['/insights']
    const tags = [`post:${id}`]
    if (event.slug) {
      paths.push(`/insights/${event.slug}`)
      tags.push(`post-slug:${event.slug}`)
    }
    if (event.previousSlug && event.previousSlug !== event.slug) {
      paths.push(`/insights/${event.previousSlug}`)
      tags.push(`post-slug:${event.previousSlug}`)
    }
    tags.push('posts', 'sitemap')
    return { paths, tags }
  }

  return {
    paths: ['/insights'],
    tags: [`${TAG_PREFIX[event.collection]}:${id}`, 'posts', 'sitemap'],
  }
}

export const createSignedRevalidationRequest = ({
  deliveryID,
  event,
  now = Date.now(),
  secret,
}: {
  deliveryID: string
  event: RevalidationEvent
  now?: number
  secret: string
}): { body: string; signature: string; timestamp: string } => {
  assertSecret(secret)
  assertEvent(event)
  if (!/^[A-Za-z0-9_-]{1,128}$/u.test(deliveryID)) throw new Error('Invalid delivery ID.')
  const timestamp = String(Math.trunc(now))
  const body = JSON.stringify({ deliveryID, event, timestamp: Number(timestamp) } satisfies SignedPayload)
  const signature = `sha256=${sign(body, timestamp, secret).toString('hex')}`
  return { body, signature, timestamp }
}

export const verifySignedRevalidationRequest = ({
  body,
  now = Date.now(),
  secret,
  signature,
  timestamp,
}: {
  body: string
  now?: number
  secret: string
  signature: string
  timestamp: string
}): SignedPayload | null => {
  assertSecret(secret)
  if (body.length > 16_384 || !/^\d{13}$/u.test(timestamp) || !signature.startsWith('sha256=')) return null
  const requestTime = Number(timestamp)
  if (Math.abs(now - requestTime) > MAX_AGE_MS) return null

  try {
    const actual = Buffer.from(signature.slice(7), 'hex')
    const expected = sign(body, timestamp, secret)
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null
    const parsed = JSON.parse(body) as Partial<SignedPayload>
    if (
      parsed.timestamp !== requestTime ||
      typeof parsed.deliveryID !== 'string' ||
      !/^[A-Za-z0-9_-]{1,128}$/u.test(parsed.deliveryID) ||
      !isEvent(parsed.event)
    ) return null
    return parsed as SignedPayload
  } catch {
    return null
  }
}

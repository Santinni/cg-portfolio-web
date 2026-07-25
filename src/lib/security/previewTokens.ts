import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const AUDIENCE = 'codeguy-preview'
const DEFAULT_TTL_SECONDS = 300
const MAX_TTL_SECONDS = 600

export type PreviewClaims = {
  aud: typeof AUDIENCE
  exp: number
  iat: number
  jti: string
  slug: string
  sub: string
}

const assertSecret = (secret: string): void => {
  if (secret.length < 32) throw new Error('Preview signing secret must contain at least 32 characters.')
}

const sign = (value: string, secret: string): Buffer =>
  createHmac('sha256', secret).update(value, 'utf8').digest()

const isSlug = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value)

const isDocumentID = (value: unknown): value is number | string =>
  (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) ||
  (typeof value === 'string' && /^[A-Za-z0-9_-]{1,128}$/u.test(value))

export const issuePreviewToken = ({
  documentID,
  now = Date.now(),
  secret,
  slug,
  ttlSeconds = DEFAULT_TTL_SECONDS,
}: {
  documentID: number | string
  now?: number
  secret: string
  slug: string
  ttlSeconds?: number
}): string => {
  assertSecret(secret)
  if (
    !isDocumentID(documentID) ||
    !isSlug(slug) ||
    !Number.isFinite(ttlSeconds) ||
    ttlSeconds < 1 ||
    ttlSeconds > MAX_TTL_SECONDS
  ) {
    throw new Error('Invalid preview token input.')
  }

  const issuedAt = Math.floor(now / 1000)
  const claims: PreviewClaims = {
    aud: AUDIENCE,
    exp: issuedAt + Math.trunc(ttlSeconds),
    iat: issuedAt,
    jti: randomBytes(16).toString('base64url'),
    slug,
    sub: String(documentID),
  }
  const encodedClaims = Buffer.from(JSON.stringify(claims), 'utf8').toString('base64url')
  return `${encodedClaims}.${sign(encodedClaims, secret).toString('base64url')}`
}

export const verifyPreviewToken = ({
  now = Date.now(),
  secret,
  token,
}: {
  now?: number
  secret: string
  token: string
}): PreviewClaims | null => {
  assertSecret(secret)
  if (!token || token.length > 4096) return null
  const [encodedClaims, encodedSignature, extra] = token.split('.')
  if (!encodedClaims || !encodedSignature || extra) return null

  try {
    const actual = Buffer.from(encodedSignature, 'base64url')
    const expected = sign(encodedClaims, secret)
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null

    const claims = JSON.parse(Buffer.from(encodedClaims, 'base64url').toString('utf8')) as Partial<PreviewClaims>
    const currentTime = Math.floor(now / 1000)
    if (
      claims.aud !== AUDIENCE ||
      typeof claims.exp !== 'number' ||
      typeof claims.iat !== 'number' ||
      typeof claims.jti !== 'string' ||
      !isDocumentID(claims.sub) ||
      !isSlug(claims.slug) ||
      claims.exp <= currentTime ||
      claims.iat > currentTime + 30 ||
      claims.exp - claims.iat > MAX_TTL_SECONDS
    ) return null

    return claims as PreviewClaims
  } catch {
    return null
  }
}

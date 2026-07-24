type PostDraft = Record<string, unknown> & { _status?: 'draft' | 'published' | null }

const isPresent = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined
}

export const assertPublishedPostIsComplete = (post: PostDraft): void => {
  if (post._status !== 'published') return

  const requiredFields = [
    'title',
    'slug',
    'excerpt',
    'content',
    'featuredImage',
    'topics',
    'author',
    'publishedAt',
  ] as const
  const missing = requiredFields.filter((field) => !isPresent(post[field]))

  if (missing.length) {
    throw new Error(`Published posts require: ${missing.join(', ')}`)
  }
}

export const validateStableSlug = (
  nextSlug: unknown,
  originalDoc: PostDraft | null | undefined,
  actorIsAdmin: boolean,
): void => {
  if (
    (originalDoc?._status === 'published' ||
      (originalDoc && isPresent(originalDoc.firstPublishedAt))) &&
    typeof originalDoc.slug === 'string' &&
    nextSlug !== undefined &&
    nextSlug !== originalDoc.slug &&
    !actorIsAdmin
  ) {
    throw new Error('The slug cannot be changed after publication except by an administrator.')
  }
}

export const validateMediaAlt = (
  value: unknown,
  siblingData: { decorative?: boolean | null },
): true | string => {
  if (siblingData.decorative || (typeof value === 'string' && value.trim())) return true
  return 'Alt text is required unless the image is explicitly decorative.'
}

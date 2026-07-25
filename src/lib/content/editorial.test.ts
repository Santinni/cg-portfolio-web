import assert from 'node:assert/strict'
import test from 'node:test'

import {
  assertMediaUploadIsAllowed,
  containsLexicalMediaReference,
  MAX_MEDIA_FILE_SIZE,
  preventReferencedMediaDeletion,
} from './mediaGuards.ts'
import { preparePost } from './postHooks.ts'
import { calculateReadingTime, extractLexicalText } from './readingTime.ts'
import {
  assertPublishedPostIsComplete,
  validateMediaAlt,
  validateStableSlug,
} from './validation.ts'

test('extracts nested Lexical text and calculates a minimum one-minute read', () => {
  const content = {
    root: {
      children: [
        { children: [{ text: 'První odstavec' }] },
        { children: [{ text: 'a druhý odstavec.' }] },
      ],
    },
  }

  assert.equal(extractLexicalText(content), 'První odstavec a druhý odstavec.')
  assert.equal(calculateReadingTime(content), 1)
})

test('rounds reading time up at 200 words per minute', () => {
  const content = { root: { children: [{ text: Array.from({ length: 201 }, () => 'slovo').join(' ') }] } }

  assert.equal(calculateReadingTime(content), 2)
})

test('includes allowlisted text from serialized custom Lexical blocks', () => {
  const content = {
    root: {
      children: [
        {
          type: 'block',
          fields: {
            blockType: 'callout',
            title: 'Důležité upozornění',
            body: 'Text uvnitř calloutu se počítá.',
            tone: 'warning',
          },
        },
        {
          type: 'block',
          fields: { blockType: 'codeBlock', language: 'typescript', source: 'const answer = 42' },
        },
      ],
    },
  }

  assert.equal(
    extractLexicalText(content),
    'Důležité upozornění Text uvnitř calloutu se počítá. const answer = 42',
  )
})

test('requires the editorial contract before publishing', () => {
  assert.throws(
    () => assertPublishedPostIsComplete({ _status: 'published', title: 'Incomplete' }),
    /excerpt, content, featuredImage, topics, author, publishedAt/,
  )

  assert.doesNotThrow(() =>
    assertPublishedPostIsComplete({
      _status: 'published',
      author: 'author-id',
      content: { root: { children: [{ text: 'Body' }] } },
      excerpt: 'Summary',
      featuredImage: 'media-id',
      publishedAt: new Date().toISOString(),
      slug: 'complete-post',
      title: 'Complete post',
      topics: ['topic-id'],
    }),
  )
})

test('prevents non-admin slug changes after first publication', () => {
  assert.throws(
    () => validateStableSlug('new-slug', { _status: 'published', slug: 'old-slug' }, false),
    /cannot be changed after publication/,
  )
  assert.doesNotThrow(() =>
    validateStableSlug('new-slug', { _status: 'published', slug: 'old-slug' }, true),
  )
})

test('requires alt text unless the media item is explicitly decorative', () => {
  assert.match(String(validateMediaAlt('', { decorative: false })), /Alt text is required/)
  assert.equal(validateMediaAlt('', { decorative: true }), true)
  assert.equal(validateMediaAlt('Portrait of Karel', { decorative: false }), true)
})

test('rejects unsafe media types and oversized uploads', () => {
  assert.throws(
    () => assertMediaUploadIsAllowed({ mimetype: 'image/svg+xml', size: 1024 }),
    /Only AVIF, JPEG, PNG and WebP/,
  )
  assert.throws(
    () => assertMediaUploadIsAllowed({ mimetype: 'image/webp', size: MAX_MEDIA_FILE_SIZE + 1 }),
    /must not exceed 10 MB/,
  )
  assert.doesNotThrow(() =>
    assertMediaUploadIsAllowed({ mimetype: 'image/avif', size: MAX_MEDIA_FILE_SIZE }),
  )
})

test('detects only exact media relationships in Lexical upload nodes', () => {
  const content = {
    root: {
      children: [
        { type: 'paragraph', children: [{ text: 'The number 17 in ordinary prose.' }] },
        { type: 'upload', relationTo: 'media', value: { id: 42 } },
      ],
    },
  }

  assert.equal(containsLexicalMediaReference(content, 42), true)
  assert.equal(containsLexicalMediaReference(content, '42'), true)
  assert.equal(containsLexicalMediaReference(content, 17), false)
  assert.equal(
    containsLexicalMediaReference({ type: 'upload', relationTo: 'authors', value: 42 }, 42),
    false,
  )
})

test('prevents deleting media referenced by editorial image fields', async () => {
  const scenarios = [
    { collection: 'posts', doc: { featuredImage: 42 }, field: 'featuredImage' },
    { collection: 'posts', doc: { socialImage: 42 }, field: 'socialImage' },
    { collection: 'posts', doc: { meta: { image: 42 } }, field: 'meta.image' },
    { collection: 'authors', doc: { portrait: 42 }, field: 'portrait' },
  ] as const

  for (const scenario of scenarios) {
    await assert.rejects(
      () =>
        preventReferencedMediaDeletion({
          id: 42,
          req: {
            payload: {
              find: async ({ collection }: { collection: string }) => ({
                docs: collection === scenario.collection ? [scenario.doc] : [],
              }),
            },
          },
        } as never),
      /still referenced by content/,
      scenario.field,
    )
  }
})

test('keeps firstPublishedAt immutable and forces author ownership', () => {
  const firstPublishedAt = '2026-01-02T03:04:05.000Z'
  const result = preparePost({
    data: {
      _status: 'draft',
      author: 'someone-else',
      firstPublishedAt: null,
      slug: 'stable-slug',
    },
    originalDoc: {
      _status: 'draft',
      author: 'linked-author',
      firstPublishedAt,
      slug: 'stable-slug',
    },
    req: {
      user: {
        id: 'user-1',
        role: 'author',
        author: 'linked-author',
      },
    },
  } as never) as Record<string, unknown>

  assert.equal(result.firstPublishedAt, firstPublishedAt)
  assert.equal(result.author, 'linked-author')
})

test('rejects an author account without an author profile', () => {
  assert.throws(
    () =>
      preparePost({
        data: { _status: 'draft', slug: 'draft' },
        req: { user: { id: 'user-1', role: 'author' } },
      } as never),
    /must be linked to an author profile/,
  )
})

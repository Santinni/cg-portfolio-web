import assert from 'node:assert/strict'
import test from 'node:test'

import type { Post } from '../../payload-types.ts'

import { buildPublishedPostWhere, mapPublicPost, normalizePagination } from './publicContent.ts'

test('published post queries cannot omit the public status constraint', () => {
	assert.deepEqual(buildPublishedPostWhere({ slug: 'typed-content-layer' }), {
		_status: { equals: 'published' },
		slug: { equals: 'typed-content-layer' },
	})

	assert.deepEqual(buildPublishedPostWhere({ excludeNoIndex: true, topicSlug: 'payload' }), {
		_status: { equals: 'published' },
		noIndex: { not_equals: true },
		'topics.slug': { equals: 'payload' },
	})
})

test('pagination is bounded before reaching Payload', () => {
	assert.deepEqual(normalizePagination({ limit: 500, page: -3 }), { limit: 24, page: 1 })
	assert.deepEqual(normalizePagination({ limit: 8, page: 2 }), { limit: 8, page: 2 })
})

test('public post mapping requires populated safe relationships', () => {
	const post = {
		_status: 'published',
		author: {
			id: 7,
			name: 'Karel',
			role: 'Engineer',
			biography: 'Bio',
			createdAt: '',
			updatedAt: '',
		},
		content: { root: { children: [] } },
		createdAt: '2026-01-01T00:00:00.000Z',
		excerpt: 'Summary',
		featuredImage: {
			id: 9,
			decorative: false,
			alt: 'Cover',
			createdAt: '',
			updatedAt: '',
			uploadedBy: { id: 1, email: 'private@example.test' },
			url: '/cover.jpg',
		},
		id: 42,
		readingTime: 3,
		relatedPosts: [99, { id: 100, _status: 'published' }, { id: 101, _status: 'draft' }],
		slug: 'typed-content-layer',
		title: 'Typed content layer',
		topics: [{ id: 2, label: 'Payload', slug: 'payload', order: 1, createdAt: '', updatedAt: '' }],
		updatedAt: '2026-01-02T00:00:00.000Z',
	} as unknown as Post

	const mapped = mapPublicPost(post)
	assert.equal(mapped?.author.name, 'Karel')
	assert.equal(mapped?.featuredImage.alt, 'Cover')
	assert.deepEqual(mapped?.relatedPostIDs, [100])
	assert.equal('uploadedBy' in mapped.featuredImage, false)
	assert.equal(mapPublicPost({ ...post, author: 7 }), null)
})

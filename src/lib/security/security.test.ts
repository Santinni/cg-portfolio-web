import assert from 'node:assert/strict'
import test from 'node:test'

import { issuePreviewToken, verifyPreviewToken } from './previewTokens.ts'
import {
	createSignedRevalidationRequest,
	getRevalidationTargets,
	verifySignedRevalidationRequest,
} from './revalidation.ts'

const secret = '0123456789abcdef0123456789abcdef'
const now = new Date('2026-07-23T12:00:00.000Z').getTime()

test('preview tokens are audience-bound, expire, and reject tampering', () => {
	const token = issuePreviewToken({ documentID: 42, now, secret, slug: 'secure-preview' })
	assert.equal(verifyPreviewToken({ now: now + 1_000, secret, token })?.slug, 'secure-preview')
	assert.equal(verifyPreviewToken({ now: now + 301_000, secret, token }), null)
	assert.equal(verifyPreviewToken({ now, secret, token: `${token}x` }), null)
	assert.throws(
		() => issuePreviewToken({ documentID: '', now, secret, slug: 'secure-preview' }),
		/Invalid preview token input/,
	)
})

test('signed revalidation verifies freshness and body integrity', () => {
	const request = createSignedRevalidationRequest({
		deliveryID: 'delivery-1',
		event: { collection: 'posts', documentID: 42, operation: 'publish', slug: 'secure-preview' },
		now,
		secret,
	})

	assert.equal(
		verifySignedRevalidationRequest({ ...request, now: now + 1_000, secret })?.deliveryID,
		'delivery-1',
	)
	assert.equal(verifySignedRevalidationRequest({ ...request, now: now + 301_000, secret }), null)
	assert.equal(
		verifySignedRevalidationRequest({ ...request, body: `${request.body} `, now, secret }),
		null,
	)
})

test('revalidation targets are derived from an allowlisted event, never accepted from clients', () => {
	assert.deepEqual(
		getRevalidationTargets({
			collection: 'posts',
			documentID: 42,
			operation: 'update',
			previousSlug: 'old-slug',
			slug: 'new-slug',
		}),
		{
			paths: ['/insights', '/insights/new-slug', '/insights/old-slug'],
			tags: ['post:42', 'post-slug:new-slug', 'post-slug:old-slug', 'posts', 'sitemap'],
		},
	)

	assert.deepEqual(
		getRevalidationTargets({
			collection: 'media',
			documentID: 9,
			operation: 'update',
		}),
		{ paths: ['/insights'], tags: ['media:9', 'posts', 'sitemap'] },
	)

	assert.throws(
		() =>
			getRevalidationTargets({
				collection: 'posts',
				documentID: 42,
				operation: 'update',
				slug: '../admin',
			}),
		/Invalid revalidation event/,
	)
})

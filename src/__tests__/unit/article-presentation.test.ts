import { createTranslator } from 'next-intl'
import { describe, expect, it } from 'vitest'

import {
	formatArticleDate,
	getArticleHref,
	getReadingTime,
} from '@/lib/content/articlePresentation'
import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

const en = createTranslator({ locale: 'en', messages: enMessages })
const cs = createTranslator({ locale: 'cs', messages: csMessages })

describe('article presentation', () => {
	it('formats dates for the requested locale in a deterministic Prague timezone', () => {
		const value = '2026-01-01T23:30:00.000Z'

		expect(formatArticleDate(value, 'en')?.label).toBe('Jan 2, 2026')
		expect(formatArticleDate(value, 'cs')?.label).toBe('2. 1. 2026')
	})

	it('uses ICU reading-time plural rules for English 1, 2 and 5', () => {
		const format = (minutes: number) => en('article.readingTime', { minutes })

		expect(getReadingTime(1, format)).toBe('1 min read')
		expect(getReadingTime(2, format)).toBe('2 min read')
		expect(getReadingTime(5, format)).toBe('5 min read')
	})

	it('uses ICU reading-time plural rules for Czech 1, 2 and 5', () => {
		const format = (minutes: number) => cs('article.readingTime', { minutes })

		expect(getReadingTime(1, format)).toBe('1 minuta čtení')
		expect(getReadingTime(2, format)).toBe('2 minuty čtení')
		expect(getReadingTime(5, format)).toBe('5 minut čtení')
	})

	it('keeps CMS article detail URLs on the unprefixed English route', () => {
		expect(getArticleHref('frontend-systems')).toBe('/insights/frontend-systems')
	})
})

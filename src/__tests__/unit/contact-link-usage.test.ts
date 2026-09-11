import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { contactMethods } from '@/content/contact'
import { contact } from '@/content/site'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

const contactSurfaces = [
	'src/app/[locale]/(frontend)/(pages)/curriculum-vitae/page.tsx',
	'src/app/[locale]/(frontend)/(pages)/contact/page.tsx',
] as const

function readSurface(path: string) {
	return readFileSync(join(process.cwd(), path), 'utf8')
}

const methodsByKey = Object.fromEntries(contactMethods.map((method) => [method.key, method]))

describe('contact contract', () => {
	it('derives every destination from the single contact source', () => {
		expect(methodsByKey.email.href).toBe(`mailto:${contact.email}`)
		expect(methodsByKey.email.value).toBe(contact.email)
		expect(methodsByKey.linkedin.href).toBe(contact.linkedin)
		expect(methodsByKey.github.href).toBe(contact.github)
		expect(methodsByKey.linkedin.external).toBe(true)
		expect(methodsByKey.github.external).toBe(true)

		// Location is metadata, not a destination (CV-05).
		expect(methodsByKey.location.href).toBeUndefined()
		expect(methodsByKey.location.external).toBeUndefined()
	})

	it.each([
		['en', enMessages],
		['cs', csMessages],
	] as const)('labels every %s method and gives location a rendered value', (_locale, messages) => {
		for (const method of contactMethods) {
			expect(messages.contact.methods[method.key].label.trim()).not.toBe('')
		}

		expect(messages.contact.methods.location.value.trim()).not.toBe('')
	})

	it.each(contactSurfaces)('%s routes its contact rows through the primitive', (path) => {
		const source = readSurface(path)

		expect(source).toContain("from '@/components/site/ContactLink'")
		expect(source).toContain("from '@/content/contact'")
	})

	it.each(contactSurfaces)('%s carries no bespoke contact anchor', (path) => {
		const source = readSurface(path)

		expect(source).not.toMatch(/mailto:/)
		expect(source).not.toMatch(/linkedin\.com|github\.com/)
	})
})

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import * as esbuild from 'esbuild'

import { repoRoot } from './paths.mjs'

/**
 * Loads the canonical CV facts straight from the TypeScript source the website
 * renders. Bundling rather than re-declaring is the point: there is exactly one
 * place where a company name or a date lives, and the PDF cannot drift from it.
 */
export async function loadFacts() {
	const bundle = await esbuild.build({
		entryPoints: [resolve(repoRoot, 'src/content/curriculum-vitae.ts')],
		bundle: true,
		format: 'esm',
		platform: 'node',
		write: false,
		alias: { '@': resolve(repoRoot, 'src') },
	})

	const code = bundle.outputFiles[0].text
	const moduleUrl = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
	return await import(moduleUrl)
}

export async function loadMessages(locale) {
	const raw = await readFile(resolve(repoRoot, `messages/${locale}.json`), 'utf8')
	const catalog = JSON.parse(raw)

	// Location lives with the shared contact contract, so the masthead prints the
	// same string the CV page renders instead of a second copy of it.
	return {
		...catalog.curriculumVitae,
		contact: { location: catalog.contact.methods.location.value },
	}
}

/** Top-level keys a variant may set. Anything else is refused by name. */
export const VARIANT_KEYS = [
	'$comment',
	'slug',
	'company',
	'position',
	'locale',
	'headline',
	'taglineKeywords',
	'summary',
	'highlightsTitle',
	'highlights',
	'skills',
	'emphasizeSkills',
	'experienceCopy',
	'earlierExperienceCopy',
	'emphasizeExperience',
	'hideExperience',
]

/** Hard facts. A variant that names any of these is a copy, not an overlay. */
const FACT_KEYS = ['experience', 'education', 'person', 'contact', 'languages']

/** Per-role prose a variant may rewrite. Title, company, period and stack are facts. */
const EXPERIENCE_COPY_KEYS = ['$comment', 'summary', 'bullets']

/**
 * A variant is an overlay, never a copy. It may reorder, re-emphasise and
 * rewrite prose, but the hard facts always come from loadFacts().
 */
export async function loadVariant(variantPath) {
	if (!variantPath) return null

	const raw = await readFile(resolve(process.cwd(), variantPath), 'utf8')
	return validateVariant(JSON.parse(raw), variantPath)
}

/**
 * Refuses a variant that steps outside the overlay contract. Exported so the
 * contract can be tested without touching the filesystem.
 */
export function validateVariant(variant, label = 'variant') {
	if (!variant || typeof variant !== 'object' || Array.isArray(variant)) {
		throw new Error(`Variant "${label}" must be a JSON object.`)
	}

	const facts = FACT_KEYS.filter((key) => key in variant)
	if (facts.length > 0) {
		throw new Error(
			`Variant "${label}" tries to redefine hard facts: ${facts.join(', ')}.\n` +
				`Variants may only set ${VARIANT_KEYS.filter((k) => k !== '$comment').join(', ')}. ` +
				'Change the facts in src/content/curriculum-vitae.ts instead.',
		)
	}

	const unknown = Object.keys(variant).filter((key) => !VARIANT_KEYS.includes(key))
	if (unknown.length > 0) {
		throw new Error(
			`Variant "${label}" sets unknown keys: ${unknown.join(', ')}.\n` +
				`Allowed keys: ${VARIANT_KEYS.filter((k) => k !== '$comment').join(', ')}.`,
		)
	}

	if (variant.locale !== undefined && !['en', 'cs'].includes(variant.locale)) {
		throw new Error(`Variant "${label}" names an unknown locale "${variant.locale}".`)
	}

	if (variant.summary !== undefined) {
		const paragraphs = Array.isArray(variant.summary) ? variant.summary : [variant.summary]
		if (paragraphs.length === 0 || paragraphs.some((p) => typeof p !== 'string' || !p.trim())) {
			throw new Error(`Variant "${label}": summary must be a non-empty string or array of strings.`)
		}
	}

	if (variant.skills !== undefined) {
		if (!Array.isArray(variant.skills) || variant.skills.length === 0) {
			throw new Error(`Variant "${label}": skills must be a non-empty array.`)
		}
		for (const [index, row] of variant.skills.entries()) {
			if (typeof row === 'string') continue // bare catalog id
			const ok =
				row &&
				typeof row === 'object' &&
				(typeof row.id === 'string' ||
					(typeof row.title === 'string' && typeof row.description === 'string'))
			if (!ok) {
				throw new Error(
					`Variant "${label}": skills[${index}] must be a catalog id, or an object with ` +
						'"id" and/or both "title" and "description".',
				)
			}
		}
	}

	if (variant.experienceCopy !== undefined) {
		if (!variant.experienceCopy || typeof variant.experienceCopy !== 'object') {
			throw new Error(`Variant "${label}": experienceCopy must be an object keyed by role id.`)
		}
		for (const [id, copy] of Object.entries(variant.experienceCopy)) {
			if (id.startsWith('$')) continue
			const bad = Object.keys(copy ?? {}).filter((key) => !EXPERIENCE_COPY_KEYS.includes(key))
			if (bad.length > 0) {
				throw new Error(
					`Variant "${label}": experienceCopy.${id} sets ${bad.join(', ')}. ` +
						'Only summary and bullets are prose; title, company, period and stack are facts.',
				)
			}
			if (copy.bullets !== undefined) {
				const ok =
					Array.isArray(copy.bullets) &&
					copy.bullets.length > 0 &&
					copy.bullets.every((line) => typeof line === 'string' && line.trim())
				if (!ok) {
					throw new Error(
						`Variant "${label}": experienceCopy.${id}.bullets must be a non-empty array of strings.`,
					)
				}
			}
		}
	}

	if (variant.earlierExperienceCopy !== undefined) {
		for (const [id, copy] of Object.entries(variant.earlierExperienceCopy)) {
			if (id.startsWith('$')) continue
			const bad = Object.keys(copy ?? {}).filter((key) => !['$comment', 'summary'].includes(key))
			if (bad.length > 0) {
				throw new Error(
					`Variant "${label}": earlierExperienceCopy.${id} sets ${bad.join(', ')}. Only summary is prose.`,
				)
			}
		}
	}

	return variant
}

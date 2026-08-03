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
	return JSON.parse(raw).curriculumVitae
}

/**
 * A variant is an overlay, never a copy. It may reorder, re-emphasise and
 * rewrite prose, but the hard facts always come from loadFacts().
 */
export async function loadVariant(variantPath) {
	if (!variantPath) return null

	const raw = await readFile(resolve(process.cwd(), variantPath), 'utf8')
	const variant = JSON.parse(raw)

	const forbidden = ['experience', 'education', 'person', 'contact']
	const violations = forbidden.filter((key) => key in variant)
	if (violations.length > 0) {
		throw new Error(
			`Variant "${variantPath}" tries to redefine hard facts: ${violations.join(', ')}.\n` +
				'Variants may only set headline, summary, highlights, emphasizeExperience, ' +
				'hideExperience and emphasizeSkills. Change the facts in ' +
				'src/content/curriculum-vitae.ts instead.',
		)
	}

	return variant
}



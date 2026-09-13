import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

import csMessages from '../../../messages/cs.json'
import enMessages from '../../../messages/en.json'

const appRoot = join(process.cwd(), 'src', 'app')

const LABEL_KEY = 'curriculumVitae.download.label'
const ACCESSIBILITY_KEY = 'curriculumVitae.download.accessibilityLabel'

interface DownloadActionUsage {
	file: string
	source: string
	props: string
}

function collectTsxFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) return collectTsxFiles(path)
		return entry.isFile() && path.endsWith('.tsx') ? [path] : []
	})
}

/** Maps every `getTranslations`/`useTranslations` binding in a file to its namespace. */
function collectTranslatorNamespaces(source: string): Map<string, string> {
	const namespaces = new Map<string, string>()
	const pattern = /const\s+(\w+)\s*=\s*(?:await\s+)?(?:get|use)Translations\(\s*'([^']+)'/g

	for (const [, binding, namespace] of source.matchAll(pattern)) {
		namespaces.set(binding, namespace)
	}

	return namespaces
}

/** Resolves `label={someT('a.b')}` to the fully qualified catalog key it reads. */
function resolveTranslationProp(usage: DownloadActionUsage, prop: string): string | null {
	const match = usage.props.match(new RegExp(`${prop}=\\{(\\w+)\\('([^']+)'\\)\\}`))
	if (!match) return null

	const namespace = collectTranslatorNamespaces(usage.source).get(match[1])
	return namespace ? `${namespace}.${match[2]}` : null
}

const tsxFiles = collectTsxFiles(appRoot)

const usages: DownloadActionUsage[] = tsxFiles.flatMap((file) => {
	const source = readFileSync(file, 'utf8')

	return [...source.matchAll(/<DownloadAction\b([\s\S]*?)\/>/g)].map((match) => ({
		file: relative(process.cwd(), file).replaceAll('\\', '/'),
		source,
		props: match[1],
	}))
})

describe('DownloadAction usage rules', () => {
	it('finds every rendered download control', () => {
		expect(usages.length).toBeGreaterThanOrEqual(4)
		expect([...new Set(usages.map(({ file }) => file))].sort()).toEqual([
			'src/app/[locale]/(frontend)/(pages)/curriculum-vitae/page.tsx',
			'src/app/[locale]/(frontend)/(pages)/experience/page.tsx',
		])
	})

	it.each(usages.map((usage, index) => [`${usage.file}#${index}`, usage] as const))(
		'%s resolves its file from the locale-aware CV model',
		(_id, usage) => {
			expect(usage.props).toMatch(/href=\{pdf\.href\}/)
			expect(usage.source).toContain('curriculumVitae.pdfByLocale[')
		},
	)

	it.each(usages.map((usage, index) => [`${usage.file}#${index}`, usage] as const))(
		'%s reads its visible and accessible names from the shared catalog entries',
		(_id, usage) => {
			expect(resolveTranslationProp(usage, 'label')).toBe(LABEL_KEY)
			expect(resolveTranslationProp(usage, 'accessibilityLabel')).toBe(ACCESSIBILITY_KEY)
		},
	)

	it.each([
		['en', enMessages],
		['cs', csMessages],
	] as const)('keeps the %s visible label inside the accessible name (WCAG 2.5.3)', (_id, m) => {
		const { label, accessibilityLabel } = m.curriculumVitae.download

		expect(accessibilityLabel).toContain(label)
		expect(accessibilityLabel).not.toBe(label)
	})

	it('leaves no bespoke PDF anchor outside the primitive', () => {
		const offenders = tsxFiles
			.filter((file) => /href="[^"]*\.pdf"/.test(readFileSync(file, 'utf8')))
			.map((file) => relative(process.cwd(), file))

		expect(offenders).toEqual([])
	})
})

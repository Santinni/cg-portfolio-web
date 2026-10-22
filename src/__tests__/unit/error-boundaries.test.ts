import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'

import { describe, expect, it } from 'vitest'

import { contact } from '@/content/site'

/**
 * A visitor must never see a browser or framework error screen (2026-10-22: every app
 * start answered a bare "HTTP ERROR 503" for about a minute). Two layers own that:
 *
 * - Next.js: every root layout tree renders branded 404 and error boundaries, and a
 *   failure inside a root layout itself falls back to `global-error.tsx`. The unprefixed
 *   English tree is a separate root, so it needs its own files; a missing one silently
 *   restores the framework page for that tree only.
 * - Caddy: while the app is unreachable the proxy holds the request, and when it still
 *   fails it serves errors/503.html for its own 502/503/504 with the original status,
 *   not 200. That page must render with the app down, so it carries everything inline.
 */
const repoRoot = resolve(__dirname, '../../..')
const appRoot = join(repoRoot, 'src/app')

// Payload's admin tree ships its own chrome and is tunnel-only; not a visitor surface.
const excludedRoots = ['(payload)']

function walk(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name)
		return entry.isDirectory() ? walk(path) : [path]
	})
}

/** Directories holding a `layout.tsx` with no `layout.tsx` in any ancestor under src/app. */
function rootLayoutDirectories(): string[] {
	const layoutDirectories = walk(appRoot)
		.filter((path) => path.endsWith(`${sep}layout.tsx`))
		.map((path) => dirname(path))

	return layoutDirectories
		.filter(
			(directory) =>
				!layoutDirectories.some(
					(other) => other !== directory && directory.startsWith(`${other}${sep}`),
				),
		)
		.filter((directory) => {
			const relativePath = relative(appRoot, directory)
			return !excludedRoots.some((excluded) => relativePath.startsWith(excluded))
		})
		.sort()
}

describe('Next.js error boundaries', () => {
	const roots = rootLayoutDirectories()

	it('finds the localized and the unprefixed English root', () => {
		expect(roots.map((directory) => relative(appRoot, directory).split(sep).join('/'))).toEqual([
			'(english)/(frontend)',
			'[locale]/(frontend)',
		])
	})

	it.each(roots)('%s renders its own not-found and error boundary', (directory) => {
		expect(existsSync(join(directory, 'not-found.tsx'))).toBe(true)
		const errorBoundary = join(directory, 'error.tsx')
		expect(existsSync(errorBoundary)).toBe(true)
		expect(readFileSync(errorBoundary, 'utf8').startsWith("'use client'")).toBe(true)
	})

	it('keeps a full-document fallback for a failing root layout', () => {
		const source = readFileSync(join(appRoot, 'global-error.tsx'), 'utf8')
		expect(source.startsWith("'use client'")).toBe(true)
		expect(source).toContain('<html')
		expect(source).toContain('<body')
		expect(source).toContain('errors.runtime')
	})

	it('shows localized copy instead of the raw error message', () => {
		for (const file of ['[locale]/(frontend)/error.tsx', 'global-error.tsx']) {
			const source = readFileSync(join(appRoot, file), 'utf8')
			expect(source, file).not.toMatch(/error\.message/)
			expect(source, file).toMatch(/errors\.runtime/)
		}
	})
})

describe('Caddy holding page for codeguy.cz', () => {
	const caddyfile = readFileSync(join(repoRoot, 'Caddyfile'), 'utf8')
	const siteStart = caddyfile.indexOf('codeguy.cz, www.codeguy.cz {')
	const siteEnd = caddyfile.indexOf('\njobs.codeguy.cz {')
	const site = caddyfile.slice(siteStart, siteEnd)
	const proxy = site.slice(site.indexOf('reverse_proxy app:3000 {'))
	const proxyBlock = proxy.slice(0, proxy.indexOf('\n\t}'))
	const page = readFileSync(join(repoRoot, 'errors/503.html'), 'utf8')

	it('holds requests while the app starts instead of answering 503 at once', () => {
		expect(proxyBlock).toContain('lb_try_duration 60s')
		expect(proxyBlock).toContain('lb_try_interval 2s')
		expect(proxyBlock).toContain('health_interval 10s')
	})

	it('serves the holding page only for its own 502/503/504, keeping the status', () => {
		expect(site).toContain('handle_errors {')
		expect(site).toContain('expression `{http.error.status_code} in [502, 503, 504]`')
		expect(site).toContain('rewrite * /503.html')
		expect(site).toContain('root /srv/errors')
		expect(site).toContain('status {http.error.status_code}')
	})

	it('leaves the jobs.codeguy.cz block without a holding page', () => {
		expect(caddyfile.slice(siteEnd)).not.toContain('handle_errors')
	})

	it('ships the page to the Caddy container on every deploy', () => {
		const compose = readFileSync(join(repoRoot, 'compose.yaml'), 'utf8')
		const workflow = readFileSync(join(repoRoot, '.github/workflows/ci.yml'), 'utf8')
		expect(compose).toContain('- ./errors:/srv/errors:ro')
		expect(workflow).toContain('source: compose.yaml,Caddyfile,errors/503.html,deploy/backup.sh')
		expect(workflow).toContain('install -m 0644 "$release_path/errors/503.html" errors/503.html')
	})

	it('works without the app: no scripts, external assets or app-served paths', () => {
		expect(page).not.toMatch(/<(script|link|img|iframe)\b/i)
		expect(page).not.toMatch(/\b(src|href)="\/(?!\/)/)
		expect(page).not.toMatch(/url\(|@import|\/_next\//)
		expect(page).toContain('<meta http-equiv="refresh" content="10">')
		expect(page).toContain('<meta name="robots" content="noindex">')
		expect(page).toContain('prefers-color-scheme: dark')
		expect(page).toContain('prefers-reduced-motion: reduce')
		expect(page).toContain('Web se právě restartuje.')
	})

	it('repeats the public contacts from the site config and keeps the phone off (CV-04)', () => {
		expect(page).toContain(`href="mailto:${contact.email}"`)
		expect(page).toContain(`href="${contact.linkedin}"`)
		expect(page).not.toMatch(/tel:|\+420/)
	})
})

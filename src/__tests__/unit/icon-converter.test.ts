import { createRequire } from 'node:module'

import { describe, expect, it } from 'vitest'

interface PlannedComponent {
	svgFile: string
	componentName: string
	outputFile: string
}

/** The pure part of scripts/iconConverter/icon-converter.cjs (`pnpm icons:generate`). */
const converter = createRequire(import.meta.url)(
	'../../../scripts/iconConverter/icon-converter.cjs',
) as {
	generateComponentName: (svgFile: string, suffix: string) => string
	planComponents: (svgFiles: string[], suffix: string) => PlannedComponent[]
	createIndexContent: (components: PlannedComponent[]) => string
}

describe('icon converter', () => {
	it('names components after the file only, in PascalCase with the family suffix', () => {
		expect(converter.generateComponentName('chevron-left.svg', 'IconSvg')).toBe(
			'ChevronLeftIconSvg',
		)
		expect(converter.generateComponentName('chevron_left.svg', 'IconSvg')).toBe(
			'ChevronLeftIconSvg',
		)
		expect(converter.generateComponentName('chevronLeft.svg', 'IconSvg')).toBe('ChevronLeftIconSvg')
		expect(converter.generateComponentName('social/github.svg', 'IconSvg')).toBe('GithubIconSvg')
		expect(converter.generateComponentName('eon.svg', 'LogoSvg')).toBe('EonLogoSvg')
	})

	it('mirrors source subfolders in the output paths', () => {
		expect(converter.planComponents(['download.svg', 'social/github.svg'], 'IconSvg')).toEqual([
			{
				svgFile: 'download.svg',
				componentName: 'DownloadIconSvg',
				outputFile: 'DownloadIconSvg.tsx',
			},
			{
				svgFile: 'social/github.svg',
				componentName: 'GithubIconSvg',
				outputFile: 'social/GithubIconSvg.tsx',
			},
		])
	})

	it('fails on two SVGs that would produce the same component name', () => {
		expect(() =>
			converter.planComponents(['arrows/left.svg', 'chevrons/left.svg'], 'IconSvg'),
		).toThrow(/Duplicate component name LeftIconSvg: "arrows\/left.svg" and "chevrons\/left.svg"/)
	})

	it('exports every component, subfolders included, from one root index', () => {
		const index = converter.createIndexContent(
			converter.planComponents(['social/github.svg', 'download.svg'], 'IconSvg'),
		)

		expect(index).toContain("export { default as DownloadIconSvg } from './DownloadIconSvg'")
		expect(index).toContain("export { default as GithubIconSvg } from './social/GithubIconSvg'")
	})
})

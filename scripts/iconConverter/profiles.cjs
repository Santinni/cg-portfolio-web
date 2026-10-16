/**
 * Icon families generated from SVG sources into React components.
 *
 * The folder an SVG lives in decides how it is generated:
 * - icons: square glyphs sized to the surrounding text (1em × 1em)
 * - logos: brand marks of any aspect ratio, only the viewBox is kept and size comes from CSS
 *
 * Shared by icon-converter.cjs (which files go where) and svgr.config.cjs (how they are converted).
 */

/**
 * Custom SVGO plugin: paints shapes without an explicit colour in `currentColor`.
 * Paths with no `fill` render black by default, so the root `<svg>` gets `fill="currentColor"`
 * unless it already sets a fill (e.g. `fill="none"` on stroke icons, which must stay unfilled).
 */
const addRootFill = {
	name: "addRootFill",
	fn: () => ({
		element: {
			enter: (node, parentNode) => {
				if (node.name === "svg" && parentNode.type === "root" && node.attributes.fill == null) {
					node.attributes.fill = "currentColor"
				}
			},
		},
	}),
}

/** SVGO plugins applied to every family. */
const sharedSvgoPlugins = [
	{
		name: "preset-default",
		params: {
			overrides: {
				// The viewBox carries the aspect ratio; without it the graphic cannot scale.
				removeViewBox: false,
				// Every colour becomes currentColor, so colour is controlled from CSS (`color`).
				convertColors: { currentColor: true },
			},
		},
	},
	{
		name: "removeAttrs",
		params: {
			attrs: [
				// Rendering hints exported by editors; browsers do not need them.
				"image-rendering",
				"shape-rendering",
				"text-rendering",
				"version",
				// Accessibility is decided where the component is used, not in the source file.
				"role",
				"aria-.*",
			],
		},
	},
	// Prefix ids with the file name so two SVGs on one page cannot clash (e.g. two `#a` clip paths).
	"prefixIds",
	addRootFill,
]

/** @type {Array<{ name: string, sourceDir: string, outputDir: string, suffix: string, svgr: object, svgoPlugins: Array }>} */
const profiles = [
	{
		name: "icons",
		sourceDir: "src/assets/icons",
		outputDir: "src/components/icons",
		suffix: "IconSvg",
		// width/height = 1em, so the icon follows the font size of its text.
		svgr: { icon: true },
		svgoPlugins: sharedSvgoPlugins,
	},
	{
		name: "logos",
		sourceDir: "src/assets/logos",
		outputDir: "src/components/logos",
		suffix: "LogoSvg",
		// No width/height: the logo keeps its aspect ratio and takes its size from CSS.
		svgr: { dimensions: false },
		// removeDimensions also adds a viewBox from width/height when the source has none.
		svgoPlugins: [...sharedSvgoPlugins, "removeDimensions"],
	},
]

module.exports = { profiles }

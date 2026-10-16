const { profiles } = require("./profiles.cjs")

/**
 * SVGR config for icon-converter.cjs. The converter sets ICON_PROFILE to the family being
 * generated (see profiles.cjs); options shared by all families live here.
 *
 * Kept out of the project root on purpose: a root svgr.config.* would also be picked up by
 * @svgr/webpack in next.config.ts and change SVGs imported directly in code.
 */
const profile = profiles.find((p) => p.name === process.env.ICON_PROFILE)

if (!profile) {
	throw new Error(`Unknown ICON_PROFILE "${process.env.ICON_PROFILE}"`)
}

/**
 * Output shape of every component: plain arrow function plus displayName (for React DevTools).
 * The converter renames SVGR's default name (e.g. SvgEon) to ours (EonLogoSvg) afterwards.
 */
const template = (variables, { tpl }) => tpl`
${variables.imports};

${variables.interfaces};

const ${variables.componentName} = (${variables.props}) => (
  ${variables.jsx}
);

${variables.componentName}.displayName = '${variables.componentName}';

${variables.exports};
`

module.exports = {
	typescript: true,
	// React 17+ JSX transform: no `import * as React from "react"` in the output.
	jsxRuntime: "automatic",
	// Formatting is done by Biome afterwards, so the output matches the rest of the project.
	prettier: false,
	svgo: true,
	svgoConfig: { plugins: profile.svgoPlugins },
	// Decorative by default: hidden from assistive technology. Passing `title` renders a
	// <title> (linked via aria-labelledby) and turns the SVG into a named image instead.
	// Both can still be overridden from outside, because props are spread after these.
	titleProp: true,
	svgProps: {
		"aria-hidden": "{title ? undefined : true}",
		role: "{title ? 'img' : undefined}",
	},
	template,
	...profile.svgr,
}

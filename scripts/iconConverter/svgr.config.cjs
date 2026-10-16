// Both plugins are CommonJS modules whose export is the plugin function itself.
const svgoPlugin = require("@svgr/plugin-svgo")
const jsxPlugin = require("@svgr/plugin-jsx")

/**
 * SVGR config for icon-converter.cjs. Options shared by all families live here; the
 * family-specific ones (sizing, SVGO plugins) come from the profile (see profiles.cjs).
 *
 * Kept out of the project root on purpose: a root svgr.config.* would also be picked up by
 * @svgr/webpack in next.config.ts and change SVGs imported directly in code.
 */

/**
 * Output shape of every component: plain arrow function plus displayName (for React DevTools).
 * The component name comes from the converter (e.g. EonLogoSvg), passed to SVGR as state.
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

/** Builds the SVGR config for one family (profile from profiles.cjs). */
function createSvgrConfig(profile) {
	return {
		// @svgr/core applies no plugins on its own: optimise with SVGO, then turn it into JSX.
		plugins: [svgoPlugin, jsxPlugin],
		// Never read .svgrrc / svgo.config.* from the project; everything is defined here.
		runtimeConfig: false,
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
}

module.exports = { createSvgrConfig }

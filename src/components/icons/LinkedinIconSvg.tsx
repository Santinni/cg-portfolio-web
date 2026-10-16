import type { SVGProps } from 'react'
interface SVGRProps {
	title?: string
	titleId?: string
}
const LinkedinIconSvg = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 260.366 260.366"
		width="1em"
		height="1em"
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
		aria-labelledby={titleId}
		{...props}
	>
		{title ? <title id={titleId}>{title}</title> : null}
		<path d="M34.703.183C15.582.183.014 15.748 0 34.884 0 54.02 15.568 69.588 34.703 69.588c19.128 0 34.688-15.568 34.688-34.704C69.391 15.75 53.83.183 34.703.183M60.748 83.531H8.654a4.49 4.49 0 0 0-4.488 4.489v167.675a4.49 4.49 0 0 0 4.488 4.488h52.093a4.49 4.49 0 0 0 4.489-4.488V88.02a4.49 4.49 0 0 0-4.489-4.489ZM193.924 81.557c-19.064 0-35.817 5.805-46.04 15.271V88.02c0-2.48-2.01-4.489-4.489-4.489H93.424a4.49 4.49 0 0 0-4.489 4.489v167.675a4.49 4.49 0 0 0 4.489 4.488h52.044a4.49 4.49 0 0 0 4.489-4.488v-82.957c0-23.802 4.378-38.555 26.227-38.555 21.526.026 23.137 15.846 23.137 39.977v81.535a4.49 4.49 0 0 0 4.49 4.488h52.068a4.49 4.49 0 0 0 4.488-4.488v-91.977c-.001-38.253-7.553-82.161-66.443-82.161" />
	</svg>
)
LinkedinIconSvg.displayName = 'LinkedinIconSvg'
export default LinkedinIconSvg

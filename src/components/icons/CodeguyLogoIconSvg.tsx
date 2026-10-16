import type { SVGProps } from 'react'
interface SVGRProps {
	title?: string
	titleId?: string
}
const CodeguyLogoIconSvg = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		viewBox="0 0 32 32"
		fill="currentColor"
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
		aria-labelledby={titleId}
		{...props}
	>
		{title ? <title id={titleId}>{title}</title> : null}
		<path fill="currentColor" d="M25.19 23.71a12 12 0 1 1 0-15.42l-4.59 3.85a6 6 0 1 0 0 7.72Z" />
		<path fill="currentColor" d="M16 13.5h11v5H16Z" />
	</svg>
)
CodeguyLogoIconSvg.displayName = 'CodeguyLogoIconSvg'
export default CodeguyLogoIconSvg

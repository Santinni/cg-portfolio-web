import type { SVGProps } from 'react'
interface SVGRProps {
	title?: string
	titleId?: string
}
const DownloadIconSvg = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={2}
		viewBox="0 0 24 24"
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
		aria-labelledby={titleId}
		{...props}
	>
		{title ? <title id={titleId}>{title}</title> : null}
		<path d="M12 13v8l-4-4M12 21l4-4" />
		<path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284" />
	</svg>
)
DownloadIconSvg.displayName = 'DownloadIconSvg'
export default DownloadIconSvg

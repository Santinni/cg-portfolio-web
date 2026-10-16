import type { SVGProps } from 'react'
interface SVGRProps {
	title?: string
	titleId?: string
}
const KontentLogoSvg = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 555 66"
		aria-hidden={title ? undefined : true}
		role={title ? 'img' : undefined}
		aria-labelledby={titleId}
		{...props}
	>
		{title ? <title id={titleId}>{title}</title> : null}
		<g fill="currentColor">
			<path d="M400.32 0h58.299v9.646h-23.978v54.8h-10.343v-54.8H400.32zM458.45 58.793c0 3.552-2.947 6.43-6.583 6.43-3.635 0-6.582-2.878-6.582-6.43s2.947-6.43 6.582-6.43c3.636 0 6.583 2.879 6.583 6.43M555 64.447h-10.105V0H555zM93.666 66c-19.427 0-34.59-14.667-34.59-33S74.239 0 93.666 0s34.59 14.667 34.59 33-15.163 33-34.59 33m0-9.625c12.984 0 23.692-9.258 23.692-23.375 0-14.025-10.425-23.375-23.692-23.375-13.268 0-23.692 9.442-23.692 23.467 0 14.117 10.709 23.283 23.692 23.283M205.99 0h59.076v9.667h-24.297v54.78h-10.481V9.667H205.99zM381.26 57.174V0h10.5v64.447h-18.233L342.408 7.365v57.082h-10.501V0h18.233zM186.94 57.174V0h10.501v64.447h-18.233L148.089 7.365l-.001 57.082h-10.5V0h18.233zM537.9 64.447h-12.563L499.034 0h11.778zM273.61 64.447V0h48.791v9.667h-38.267V26.24h35.397v9.667h-35.397V54.78h39.224v9.667zM0 0h10.882v64.447H0zM478.82 64.449h-12.437l13.603-31.835h12.048zM33.424 32.224l24.874 32.224H44.695L20.21 32.224 44.844.001h13.454z" />
		</g>
	</svg>
)
KontentLogoSvg.displayName = 'KontentLogoSvg'
export default KontentLogoSvg

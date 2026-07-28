import type { SVGProps } from 'react'

const CodeguyLogoIconSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <rect width={32} height={32} fill="currentColor" rx={9} />
    <path
      stroke="#0a0f1c"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.75}
      d="M14.5 10h-2.75A2.75 2.75 0 0 0 9 12.75v6.5A2.75 2.75 0 0 0 11.75 22h2.75"
    />
    <path
      stroke="#0a0f1c"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.75}
      d="M23 10h-4a2.75 2.75 0 0 0-2.75 2.75v6.5A2.75 2.75 0 0 0 19 22h4v-4.5h-2.75"
    />
    <rect
      width={2.5}
      height={2.5}
      x={22.5}
      y={7}
      fill="#0a0f1c"
      rx={0.75}
    />
  </svg>
)

export default CodeguyLogoIconSvg

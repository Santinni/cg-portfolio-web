import * as React from "react";
import type { SVGProps } from "react";
const CodeguyLogoIconSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <rect width={32} height={32} fill="currentColor" rx={8} />
    <path
      stroke="#0a0f1c"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="m12 10-5 6 5 6M20 10l5 6-5 6"
    />
    <path
      stroke="#0a0f1c"
      strokeLinecap="round"
      strokeWidth={2}
      d="m18 8-4 16"
    />
  </svg>
);
export default CodeguyLogoIconSvg;


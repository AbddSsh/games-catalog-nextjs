import type { SVGProps } from "react";

export const GlobalLanguageIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.6}
        d="M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334Z"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.6}
        d="M5.333 2H6a18.949 18.949 0 0 0 0 12h-.667M10 2c1.3 3.893 1.3 8.107 0 12"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.6}
        d="M2 10.667V10c3.893 1.3 8.107 1.3 12 0v.667M2 6c3.893-1.3 8.107-1.3 12 0"
      />
    </svg>
  )
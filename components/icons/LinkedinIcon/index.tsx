// LinkedIn mark — deprecated in lucide-react; path sourced from simple-icons.
// https://simpleicons.org/icons/linkedin
import type { FC, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

const LinkedinIcon: FC<Props> = ({
  size = 24,
  strokeWidth = 1.5,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <title>LinkedIn</title>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default LinkedinIcon;

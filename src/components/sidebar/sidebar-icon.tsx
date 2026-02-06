"use client";

import type React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  isCollapsed?: boolean;
}

export const SidebarIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
  isCollapsed = false,
  ...props
}) => (
  <svg
    className={className}
    fill="currentColor"
    height={size}
    viewBox="0 0 16 16"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Sidebar Toggle</title>
    <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z" />
    <rect
      className={`transition-all duration-200 ease-in-out ${
        isCollapsed ? "w-[3px]" : "w-[6px]"
      }`}
      height="10"
      rx="1"
      x="2"
      y="3"
    />
  </svg>
);

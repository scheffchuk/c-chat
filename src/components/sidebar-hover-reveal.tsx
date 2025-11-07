"use client";

// Custom icon components for the sidebar.
import {
  ClockIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";
// Import necessary utilities and components.
// tailwind-merge is used to intelligently merge Tailwind CSS classes, preventing conflicts.
// useState is a React Hook for managing state within the component.
import type React from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  isCollapsed?: boolean;
}

const SidebarIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
  isCollapsed = false,
  ...props
}) => {
  console.log(isCollapsed);
  return (
    <svg
      className={className + "sidebar-icon-trigger"}
      fill="currentColor"
      height={size}
      viewBox="0 0 16 16"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z" />
      {/* <rect x="2" y="3" width="12" height="3" rx="1" /> */}
      <rect
        className={`${
          isCollapsed &&
          "w-[3px] group-has-[.sidebar-icon-trigger:hover]:w-[6px] group-has-[.sidebar-wrapper:hover]:w-[6px]"
        } ${
          !isCollapsed &&
          "w-[6px] group-has-[.sidebar-icon-trigger:hover]:w-[3px]"
        } transition-all duration-150 ease-in-out`}
        height="10"
        rx="1"
        x="2"
        y="3"
      />
    </svg>
  );
};

/**
 * VercelSidebar Component
 *
 * A responsive sidebar layout inspired by Vercel's UI.
 * It features a collapsible sidebar that can be toggled and also reveals itself on hover.
 * The hover-reveal functionality is triggered by a specific icon button,
 * achieved using modern CSS features with Tailwind's arbitrary variants.
 */
const VercelSidebar = () => {
  // State to manage the open/closed state of the sidebar.
  // `isOn` is true when the sidebar is open (slid out of view) and false when closed (visible).
  const [isOn, setIsOn] = useState(false);

  // Toggles the sidebar state between open and closed.
  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    // Main container for the entire page layout.
    <main className="relative flex h-screen max-h-screen flex-col overflow-y-hidden bg-background p-2 transition-all duration-200 ease-in-out">
      {/* Mobile Message */}
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center md:hidden">
        <p className="text-h2 text-subdued">Go to desktop.</p>
        <p className="mt-4 text-body-md text-subdued">
          I didn&apos;t have time for mobile responsiveness, I have a life.
        </p>
      </div>

      {/* Desktop Content */}
      <div className="hidden h-full w-full flex-col md:flex">
        {/* Header Section */}
        <div className="flex flex-row items-center gap-4 p-4">
          {/* Brand Logo */}
          <img className="h-6 w-6" src="/brand.png" />
          {/* Decorative Separator */}
          <div className="-skew-12 h-6 w-[1px] bg-primary" />
          {/* Brand Name/Title */}
          <p className="text-h3 text-subdued">Soren</p>
        </div>

        {/* Main Content Wrapper */}
        {/*
                This div is the parent container for the sidebar and the main content.
                The `group` class is crucial here. It allows child elements to change their style
                based on the state of this parent container (e.g., when it's hovered).
                We use this with the `:has()` pseudo-class to create a "reverse" group hover effect.
            */}
        <div className="group flex min-h-0 w-full flex-1 flex-row gap-4 p-2 transition-all duration-200 ease-in-out">
          {/* --- Sidebar Section --- */}
          {/*
                    This is the fixed part of the sidebar that slides in and out.
                    `twMerge` is used to conditionally apply classes.
                    When `isOn` is true, '-ml-[272px]' is applied to slide it off-screen to the left.
                */}
          <div
            className={twMerge(
              "relative h-full min-w-3xs rounded-xl bg-background p-2 transition-all duration-200 ease-in-out",
              isOn && "-ml-[272px]"
            )}
          >
            {/* --- Hover-Reveal Sidebar Content --- */}
            {/*
                        This inner div is the floating panel that appears when the sidebar is "open" (`isOn`).
                        It becomes visible and slides into view when the trigger element is hovered.
                        - `isOn` state: Applies base styles for the floating panel (size, position, etc.).
                        - `group-has-[.sidebar-icon-trigger:hover]:ml-[240px]`: This is the key.
                          If the parent `.group` has a descendant `.sidebar-icon-trigger` that is being hovered,
                          this panel will slide into view.
                        - `group-has-[.sidebar-wrapper:hover]:ml-[240px]`: This allows the panel to *stay* open
                          if the user moves their cursor onto the panel itself after triggering it.
                        - `!isOn`: Hides the panel when the sidebar is in its default closed state.
                    */}
            <div
              className={twMerge(
                "sidebar-wrapper absolute left-0 h-full w-full rounded-lg border-secondary/50 transition-all duration-200 ease-in-out",
                isOn &&
                  "z-10 h-11/12 w-3xs translate-y-12 rounded-lg-primary border bg-background p-2 pl-6 group-has-[.sidebar-icon-trigger:hover]:ml-[240px] group-has-[.sidebar-wrapper:hover]:ml-[240px]",
                !isOn && "ml-[0px] h-full border-transparent bg-transparent"
              )}
            >
              {/* Content inside the hoverable panel */}
              <div className="flex h-full flex-col gap-2">
                {/* New Chat Button */}
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-button-bg py-2 text-body-sm transition-colors duration-0 hover:bg-button-hover">
                  <PlusIcon className="text-subdued" size={16} />
                  New Chat
                </button>

                {/* Search Bar */}
                <div className="relative w-full rounded-lg bg-input-bg">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <SearchIcon className="text-subdued" size={14} />
                  </div>
                  <input
                    className="w-full rounded-lg bg-transparent py-2 pr-3 pl-9 text-body-sm placeholder:text-subdued focus:outline-none"
                    placeholder="Search..."
                    type="text"
                  />
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
                  {/* Recent Section */}
                  <div className="mt-2 mb-2">
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-xs text-subdued transition-colors duration-0 hover:bg-button-hover">
                      <ClockIcon size={14} />
                      <span>Recent</span>
                    </button>
                  </div>

                  {/* Chat History Items */}
                  <div className="space-y-1">
                    {[
                      "Design system components",
                      "API integration help",
                      "React best practices",
                      "TypeScript generics",
                      "CSS animations",
                      "Next.js routing",
                      "Database optimization",
                      "Authentication flow",
                    ].map((chat, index) => (
                      <button
                        className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-body-xs transition-colors duration-0 hover:bg-button-hover"
                        id={`recent-${index}`}
                        key={index}
                      >
                        <span className="truncate text-subdued">{chat}</span>
                      </button>
                    ))}
                  </div>

                  {/* Starred Section */}
                  <div className="mt-4 mb-2">
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-xs text-subdued transition-colors duration-0 hover:bg-button-hover">
                      <StarIcon size={14} />
                      <span>Starred</span>
                    </button>
                  </div>

                  {/* Starred Items */}
                  <div className="space-y-1">
                    {[
                      "Important project notes",
                      "Code snippets collection",
                    ].map((starred, index) => (
                      <button
                        className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-body-xs transition-colors duration-0 hover:bg-button-hover"
                        key={index}
                      >
                        <span className="truncate text-subdued">{starred}</span>
                      </button>
                    ))}
                  </div>
                </nav>

                {/* Bottom Actions */}
                <div className="space-y-1 border-secondary/50 border-t pt-2">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-xs text-subdued transition-colors duration-0 hover:bg-button-hover">
                    <TrashIcon size={14} />
                    <span>Trash</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-xs text-subdued transition-colors duration-0 hover:bg-button-hover">
                    <SettingsIcon size={14} />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- Main Content Area --- */}
          {/* This is the main panel on the right side. */}
          <div className="h-full w-full rounded-xl border-[1px] border-secondary/50 bg-foreground transition-all duration-200 ease-in-out">
            {/*
                        This div has the class `sidebar-icon-trigger`. It serves as the hover target.
                        When the user's cursor enters this div, the `group-has` condition is met,
                        which triggers the animation on the sidebar panel.
                    */}
            <div className="sidebar-icon-trigger max-w-max p-2">
              {/* The actual button that toggles the sidebar's open/closed state on click. */}
              <button
                className="rounded-lg p-2 hover:bg-button-hover"
                onClick={handleToggle}
              >
                <SidebarIcon className="text-subdued" isCollapsed={isOn} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VercelSidebar;

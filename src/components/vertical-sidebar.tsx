"use client";

// Import necessary utilities and components.
// tailwind-merge is used to intelligently merge Tailwind CSS classes, preventing conflicts.
import React from "react";
import { twMerge } from "tailwind-merge";
// useState is a React Hook for managing state within the component.
import { useState } from "react";
// Custom icon components for the sidebar.
import {
  SearchIcon,
  ClockIcon,
  StarIcon,
  TrashIcon,
  SettingsIcon,
  PlusIcon,
} from "lucide-react";

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
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className + " sidebar-icon-trigger"}
      fill="currentColor"
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
        x="2"
        y="3"
        height="10"
        rx="1"
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
    <main className="bg-background relative flex h-screen max-h-screen flex-col overflow-y-hidden p-2 transition-all duration-200 ease-in-out">
      {/* Mobile Message */}
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center md:hidden">
        <p className="text-h2 text-subdued">Go to desktop.</p>
        <p className="text-body-md text-subdued mt-4">
          I didn&apos;t have time for mobile responsiveness, I have a life.
        </p>
      </div>

      {/* Desktop Content */}
      <div className="hidden h-full w-full flex-col md:flex">
        {/* Header Section */}
        <div className="flex flex-row items-center gap-4 p-4">
          {/* Brand Logo */}
          <img src="/brand.png" className="h-6 w-6" />
          {/* Decorative Separator */}
          <div className="bg-primary h-6 w-[1px] -skew-12" />
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
              "bg-background relative h-full min-w-3xs rounded-xl p-2 transition-all duration-200 ease-in-out",
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
                "sidebar-wrapper border-secondary/50 absolute left-0 h-full w-full rounded-lg transition-all duration-200 ease-in-out",
                isOn &&
                  "bg-background rounded-lg-primary z-10 h-11/12 w-3xs translate-y-12 border p-2 pl-6 group-has-[.sidebar-icon-trigger:hover]:ml-[240px] group-has-[.sidebar-wrapper:hover]:ml-[240px]",
                !isOn && "ml-[0px] h-full border-transparent bg-transparent"
              )}
            >
              {/* Content inside the hoverable panel */}
              <div className="flex h-full flex-col gap-2">
                {/* New Chat Button */}
                <button className="bg-button-bg hover:bg-button-hover text-body-sm flex w-full items-center justify-center gap-2 rounded-lg py-2 transition-colors duration-0">
                  <PlusIcon className="text-subdued" size={16} />
                  New Chat
                </button>

                {/* Search Bar */}
                <div className="bg-input-bg relative w-full rounded-lg">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <SearchIcon className="text-subdued" size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="text-body-sm placeholder:text-subdued w-full rounded-lg bg-transparent py-2 pr-3 pl-9 focus:outline-none"
                  />
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
                  {/* Recent Section */}
                  <div className="mt-2 mb-2">
                    <button className="hover:bg-button-hover text-subdued text-body-xs flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-0">
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
                        key={index}
                        id={`recent-${index}`}
                        className="hover:bg-button-hover text-body-xs group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-0"
                      >
                        <span className="text-subdued truncate">{chat}</span>
                      </button>
                    ))}
                  </div>

                  {/* Starred Section */}
                  <div className="mt-4 mb-2">
                    <button className="hover:bg-button-hover text-subdued text-body-xs flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-0">
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
                        key={index}
                        className="hover:bg-button-hover text-body-xs group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-0"
                      >
                        <span className="text-subdued truncate">{starred}</span>
                      </button>
                    ))}
                  </div>
                </nav>

                {/* Bottom Actions */}
                <div className="border-secondary/50 space-y-1 border-t pt-2">
                  <button className="hover:bg-button-hover text-subdued text-body-xs flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-0">
                    <TrashIcon size={14} />
                    <span>Trash</span>
                  </button>
                  <button className="hover:bg-button-hover text-subdued text-body-xs flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-0">
                    <SettingsIcon size={14} />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- Main Content Area --- */}
          {/* This is the main panel on the right side. */}
          <div className="bg-foreground border-secondary/50 h-full w-full rounded-xl border-[1px] transition-all duration-200 ease-in-out">
            {/*
                        This div has the class `sidebar-icon-trigger`. It serves as the hover target.
                        When the user's cursor enters this div, the `group-has` condition is met,
                        which triggers the animation on the sidebar panel.
                    */}
            <div className="sidebar-icon-trigger max-w-max p-2">
              {/* The actual button that toggles the sidebar's open/closed state on click. */}
              <button
                className="hover:bg-button-hover rounded-lg p-2"
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

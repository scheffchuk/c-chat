"use client";

import { useRouter } from "next/navigation";
import { useHoverSidebar } from "./hover-sidebar-context";
import { PlusIcon, SearchIcon, ClockIcon, User, Variable } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";

export function AppSidebar() {
  const router = useRouter();
  const { isCollapsed, isMobile, openMobile, setOpenMobile } =
    useHoverSidebar();

  // TODO: handle delete chat?

  const sidebarContent = (
    <>
      {/* New Chat Button */}
      <button
        onClick={() => {
          router.push("/");
          router.refresh();
        }}
        className="bg-secondary hover:bg-accent text-sm flex w-full items-center justify-center gap-2 rounded-lg py-2 transition-colors duration-100 cursor-pointer"
      >
        <PlusIcon size={16} />
        New Chat
      </button>

      {/* Search Bar */}
      <div className="bg-muted relative w-full rounded-lg">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <SearchIcon className="text-muted-foreground" size={14} />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="text-sm placeholder:text-muted-foreground w-full rounded-lg bg-transparent py-2 pr-3 pl-9 focus:outline-none"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {/* Recent Section */}
        <div className="mt-2 mb-2">
          <button className="text-muted-foreground text-sm flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-100">
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
              className="hover:bg-accent text-xs group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-100"
            >
              <span className="text-muted-foreground truncate">{chat}</span>
            </button>
          ))}
        </div>

        {/* Starred Section */}
        {/* <div className="mt-4 mb-2">
          <button className="hover:bg-accent text-muted-foreground text-xs flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-100">
            <StarIcon size={14} />
            <span>Starred</span>
          </button>
        </div> */}

        {/* Starred Items */}
        {/* <div className="space-y-1">
          {[
            "Important project notes",
            "Code snippets collection",
          ].map((starred, index) => (
            <button
              key={index}
              className="hover:bg-accent text-xs group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-100"
            >
              <span className="text-muted-foreground truncate">{starred}</span>
            </button>
          ))}
        </div> */}
      </nav>

      {/* Bottom Actions */}
      <div className="border-border py-3 border-t flex items-center justify-end">
        <UserButton
          showName={true}
          appearance={{
            elements: {
              userButtonTrigger: {
                color: "var(--foreground)",
              },
            },
          }}
        />

        {/* <button className="hover:bg-accent text-muted-foreground text-xs flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-100">
          <SettingsIcon size={14} />
          <span>Settings</span>
        </button> */}
      </div>
    </>
  );

  // Mobile: render inside Sheet
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="bg-background w-[272px] p-2">
          <SheetHeader className="flex flex-row items-center justify-between px-0 py-1">
            <SheetTitle className="text-h3 text-red-400 px-2">C Chat</SheetTitle>
            <SheetDescription className="sr-only">Navigation and chat history</SheetDescription>
            <ThemeToggle/>
          </SheetHeader>
          <div className="flex h-full flex-col gap-2">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: hover-reveal structure
  return (
    /* Fixed part that slides in and out */
    <div
      className={twMerge(
        "bg-background relative h-full min-w-3xs rounded-xl p-2 transition-all duration-100 ease-in-out",
        isCollapsed && "-ml-[272px]"
      )}
    >
      {/* Hover-reveal floating panel */}
      <div
        className={twMerge(
          "sidebar-wrapper border-foreground/30 absolute left-0 h-full w-full rounded-lg transition-all duration-100 ease-in-out",
          isCollapsed &&
            "bg-background rounded-lg-primary z-10 h-11/12 w-3xs translate-y-12 border p-2 pl-6 group-has-[.sidebar-icon-trigger:hover]:ml-[240px] group-has-[.sidebar-wrapper:hover]:ml-[240px]",
          !isCollapsed && "ml-[0px] h-full border-transparent bg-transparent"
        )}
      >
        {/* Content inside the hoverable panel */}
        <div className="flex h-full flex-col gap-2">{sidebarContent}</div>
      </div>
    </div>
  );
}

"use client";

import { UserButton } from "@clerk/nextjs";
import { ClockIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useHoverSidebar } from "./hover-sidebar-context";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

export function AppSidebar() {
  const router = useRouter();
  const { isCollapsed, isMobile, openMobile, setOpenMobile } =
    useHoverSidebar();

  // TODO: handle delete chat?

  const sidebarContent = (
    <>
      {/* New Chat Button */}
      <button
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2 text-primary-foreground text-sm transition-colors duration-150 hover:bg-primary/90"
        onClick={() => {
          router.push("/");
          router.refresh();
        }}
        type="button"
      >
        <PlusIcon size={16} />
        New Chat
      </button>

      {/* Search Bar */}
      <div className="relative w-full rounded-lg bg-muted">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <SearchIcon className="text-muted-foreground" size={14} />
        </div>
        <input
          className="w-full rounded-lg bg-transparent py-2 pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:outline-none"
          placeholder="Search..."
          type="text"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {/* Recent Section */}
        <div className="mt-2 mb-2">
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground text-sm transition-colors duration-150"
            type="button"
          >
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
              className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors duration-150 hover:bg-accent"
              id={`recent-${index}`}
              key={chat}
              type="button"
            >
              <span className="truncate text-muted-foreground">{chat}</span>
            </button>
          ))}
        </div>

        {/* Starred Section */}
        {/* <div className="mt-4 mb-2">
          <button className="hover:bg-accent text-muted-foreground text-xs flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-150">
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
              className="hover:bg-accent text-xs group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-150"
            >
              <span className="text-muted-foreground truncate">{starred}</span>
            </button>
          ))}
        </div> */}
      </nav>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end border-border border-t py-3">
        <UserButton
          appearance={{
            elements: {
              userButtonTrigger: {
                color: "var(--foreground)",
              },
            },
          }}
          showName={true}
        />

        {/* <button className="hover:bg-accent text-muted-foreground text-xs flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-150">
          <SettingsIcon size={14} />
          <span>Settings</span>
        </button> */}
      </div>
    </>
  );

  // Mobile: render inside Sheet
  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile}>
        <SheetContent className="w-[272px] bg-background p-2" side="left">
          <SheetHeader className="flex flex-row items-center justify-between px-0 py-1">
            <SheetTitle className="px-2 text-h3 text-red-400">
              C Chat
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation and chat history
            </SheetDescription>
            <ThemeToggle />
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
        "relative h-full min-w-3xs rounded-xl bg-background p-2 transition-all duration-150 ease-in-out",
        isCollapsed && "-ml-[272px]"
      )}
    >
      {/* Hover-reveal floating panel */}
      <div
        className={twMerge(
          "sidebar-wrapper absolute left-0 h-full w-full rounded-lg border-foreground/30 transition-all duration-150 ease-in-out",
          isCollapsed &&
            "z-10 h-11/12 w-3xs translate-y-12 rounded-lg-primary border bg-background p-2 pl-6 group-has-[.sidebar-icon-trigger:hover]:ml-[240px] group-has-[.sidebar-wrapper:hover]:ml-[240px]",
          !isCollapsed && "ml-[0px] h-full border-transparent bg-transparent"
        )}
      >
        {/* Content inside the hoverable panel */}
        <div className="flex h-full flex-col gap-2">{sidebarContent}</div>
      </div>
    </div>
  );
}

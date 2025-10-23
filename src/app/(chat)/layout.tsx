import { HoverSidebarProvider } from "@/components/hover-sidebar-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarToggle } from "@/components/sidebar-toggle";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HoverSidebarProvider>
      <main className="bg-background relative flex h-screen max-h-screen flex-col overflow-y-hidden p-2 transition-all duration-200 ease-in-out">
        <div className="flex h-full w-full flex-col">
          <div className="flex-row items-center gap-4 p-4 hidden md:flex">
            <div className="bg-primary h-6 w-[1px] -skew-12" />
            <p className="text-h3 text-muted-foreground text-red-400">C Chat</p>
          </div>

          <div className="group flex min-h-0 w-full flex-1 flex-col md:flex-row gap-4 p-2 transition-all duration-200 ease-in-out">
            <AppSidebar />
            <div className="bg-background border-foreground/30 h-full w-full rounded-xl border transition-all duration-200 ease-in-out flex flex-col">
              <div className="sidebar-icon-trigger max-w-max p-2">
                <SidebarToggle className="rounded-lg p-2 hover:bg-accent" />
              </div>
              {children}
            </div>
          </div>
        </div>
      </main>
    </HoverSidebarProvider>
  );
}

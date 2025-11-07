import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { HoverSidebarProvider } from "@/components/hover-sidebar-context";
import NavBar from "@/components/nav-bar";
import { SidebarToggle } from "@/components/sidebar-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HoverSidebarProvider>
      <main className="relative flex h-screen max-h-screen flex-col overflow-y-hidden bg-background transition-all duration-100 ease-in-out">
        <div className="flex h-full w-full flex-col">
          <NavBar />
          <div className="group flex min-h-0 w-full flex-1 flex-col gap-4 p-2 transition-all duration-100 ease-in-out md:flex-row">
            <AppSidebar />
            <div className="flex h-full w-full flex-col rounded-xl border border-foreground/30 bg-background transition-all duration-100 ease-in-out">
              <div className="sidebar-icon-trigger max-w-max p-2">
                <SidebarToggle className="cursor-pointer p-3 hover:bg-transparent" />
              </div>
              {children}
            </div>
          </div>
        </div>
      </main>
    </HoverSidebarProvider>
  );
}

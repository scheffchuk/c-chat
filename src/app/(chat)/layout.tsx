import { HoverSidebarProvider } from "@/components/hover-sidebar-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarToggle } from "@/components/sidebar-toggle";
import React from "react";
import NavBar from "@/components/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HoverSidebarProvider>
      <main className="bg-background relative flex h-screen max-h-screen flex-col overflow-y-hidden transition-all duration-100 ease-in-out">
        <div className="flex h-full w-full flex-col">
          <NavBar />
          <div className="group flex min-h-0 w-full flex-1 flex-col md:flex-row gap-4 p-2 transition-all duration-100 ease-in-out">
            <AppSidebar />
            <div className="bg-background border-foreground/30 h-full w-full rounded-xl border transition-all duration-100 ease-in-out flex flex-col">
              <div className="sidebar-icon-trigger max-w-max p-2">
                <SidebarToggle className="p-3 hover:bg-transparent cursor-pointer" />
              </div>
              {children}
            </div>
          </div>
        </div>
      </main>
    </HoverSidebarProvider>
  );
}

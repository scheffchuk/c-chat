import type React from "react";
import { Toaster } from "sonner";
import NavBar from "@/components/nav-bar";
import {
  AppSidebar,
  SidebarProvider,
  SidebarToggle,
} from "@/components/sidebar";
import { DataStreamProvider } from "@/providers/data-stream-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DataStreamProvider>
      <SidebarProvider>
        <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-background">
          <NavBar />
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar />
            <main className="relative m-2 flex flex-1 flex-col overflow-hidden rounded-xl border border-foreground/30 bg-background">
              <div className="flex items-center p-2">
                <SidebarToggle className="cursor-pointer p-3 hover:bg-transparent hover:text-primary/90" />
              </div>
              <div className="flex-1 overflow-hidden">{children}</div>
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </DataStreamProvider>
  );
}

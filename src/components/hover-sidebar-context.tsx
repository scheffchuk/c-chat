"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type HoverSidebarContextType = {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
};

const HoverSidebarContext = createContext<HoverSidebarContextType | null>(null);

export function useHoverSidebar() {
  const context = useContext(HoverSidebarContext);
  if (!context) {
    throw new Error("useHoverSidebar must be used within HoverSidebarProvider");
  }
  return context;
}

export function HoverSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openMobile, setOpenMobile] = useState(false);
  const isMobile = useIsMobile();

  const toggleCollapsed = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, [isMobile]);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + B
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleCollapsed();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapsed]);

  return (
    <HoverSidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapsed,
        setCollapsed,
        openMobile,
        setOpenMobile,
        isMobile,
      }}
    >
      {children}
    </HoverSidebarContext.Provider>
  );
}


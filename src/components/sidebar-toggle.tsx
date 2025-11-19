"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useHoverSidebar } from "./hover-sidebar-context";
import { SidebarIcon } from "./sidebar-icon";
import { Button } from "./ui/button";
import { Tooltip, TooltipTrigger } from "./ui/tooltip";

export function SidebarToggle({ className }: ComponentProps<"button">) {
  const { toggleCollapsed, isCollapsed } = useHoverSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "sidebar-icon-trigger h-8 text-primary hover:text-primary/90 md:h-fit md:px-4",
            className
          )}
          data-testid="sidebar-toggle-button"
          onClick={toggleCollapsed}
          variant="ghost"
        >
          <SidebarIcon
            className="size-6 text-muted-foreground"
            isCollapsed={isCollapsed}
          />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </TooltipTrigger>
      {/* <TooltipContent align="start" className="hidden md:block">
        Toggle Sidebar
      </TooltipContent> */}
    </Tooltip>
  );
}

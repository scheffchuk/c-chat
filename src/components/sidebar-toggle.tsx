"use client";

import { ComponentProps } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SidebarIcon } from "./sidebar-icon";
import { useHoverSidebar } from "./hover-sidebar-context";

export function SidebarToggle({
  className,
}: ComponentProps<"button">) {
  const { toggleCollapsed, isCollapsed } = useHoverSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("sidebar-icon-trigger h-8 md:h-fit md:px-4", className)}
          data-testid="sidebar-toggle-button"
          onClick={toggleCollapsed}
          variant="ghost"
        >
          <SidebarIcon isCollapsed={isCollapsed} className="text-muted-foreground size-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </TooltipTrigger>
      {/* <TooltipContent align="start" className="hidden md:block">
        Toggle Sidebar
      </TooltipContent> */}
    </Tooltip>
  );
}

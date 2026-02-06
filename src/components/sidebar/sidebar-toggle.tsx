"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SidebarIcon } from "./sidebar-icon";
import { useSidebar } from "./sidebar-provider";

export function SidebarToggle({ className }: ComponentProps<"button">) {
  const { toggle, isOpen } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "h-8 text-primary hover:text-primary/90 md:h-fit md:px-4",
            className
          )}
          data-testid="sidebar-toggle-button"
          onClick={toggle}
          variant="ghost"
        >
          <SidebarIcon
            className="size-6 text-muted-foreground"
            isCollapsed={!isOpen}
          />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start" className="hidden md:block">
        Toggle Sidebar
      </TooltipContent>
    </Tooltip>
  );
}

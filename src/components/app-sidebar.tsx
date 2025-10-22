"use client";

import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { PlusIcon, User2Icon } from "lucide-react";

export function AppSidebar() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  // TODO: handle delete chat?

  return (
    <>
      <Sidebar className="group-data-[side=left]:border-r-0">
        <SidebarHeader>
          <SidebarMenu>
            <div className="flex flex-row items-center justify-between">
              <Link
                href="/"
                className="flex flex-row items-center gap-3"
                onClick={() => {
                  setOpenMobile(false);
                }}
              >
                <span className="cursor-pointer rounded-md px-2 font-semibold text-lg hover:bg-muted text-red-500">
                  C Chat
                </span>
              </Link>
              <div className="flex flex-row gap-1">
                {/* // TODO:Delete all chat button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-8 p-1 md:h-fit md:p-2"
                      onClick={() => {
                        setOpenMobile(false);
                        router.push("/");
                        router.refresh();
                      }}
                      type="button"
                      variant="ghost"
                    >
                      <PlusIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent align="end">New Chat</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* <SidebarHistory /> */}
          {/* <SidebarFooter>
            <User2Icon className="size-4" />
          </SidebarFooter> */}
        </SidebarContent>
      </Sidebar>
    </>
  );
}

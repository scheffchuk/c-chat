"use client";

import { useRouter } from "next/navigation";
import { useHoverSidebar } from "./hover-sidebar-context";
import { useWindowSize } from "usehooks-ts";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { SidebarToggle } from "./sidebar-toggle";

interface Props {
  chatId: string;
  selectedVisibilityType: "private" | "public";
  isReadonly: boolean;
}

function PureChatHeader({ chatId, selectedVisibilityType, isReadonly }: Props) {
  const router = useRouter();
  const { isCollapsed } = useHoverSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="sticky top-0 items-center space-x-2 gap-2 bg-background px-2 py-1.5 md:px-4">
      {(isCollapsed || windowWidth < 768) && (
        <Button
          className="order-2 ml-auto h-8 px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          variant="ghost"
        >
          <PlusIcon />
          <span className="sr-only">New Chat</span>
        </Button>
      )}

      {/* TODO: Add Visibility Selector button */}

      {/* {!isReadonly && (
        // <VisibilitySelector/>
        <Button className="order-1 md:order-2" variant="outline">
          <EyeIcon />
          <span className="sr-only">Public Chat</span>
        </Button>
      )} */}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (preProps, nextProps) => {
  return (
    preProps.chatId === nextProps.chatId &&
    preProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    preProps.isReadonly === nextProps.isReadonly
  );
});

"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useWindowSize } from "usehooks-ts";
import { useHoverSidebar } from "./hover-sidebar-context";
import { Button } from "./ui/button";

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
    <header className="sticky top-0 items-center gap-2 space-x-2 bg-background px-2 py-1.5 md:px-4">
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

export const ChatHeader = memo(
  PureChatHeader,
  (preProps, nextProps) =>
    preProps.chatId === nextProps.chatId &&
    preProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    preProps.isReadonly === nextProps.isReadonly
);

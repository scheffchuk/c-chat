"use client";

import { useConvexAuth, useMutation, usePaginatedQuery } from "convex/react";
import { ClockIcon, PlusIcon, SearchIcon, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useSidebar } from "./sidebar-provider";

function ChatHistorySkeleton() {
  const items = Array.from({ length: 5 });
  const widths = ["60%", "75%", "50%", "80%", "65%"];
  return (
    <div className="space-y-1">
      {items.map((_, i) => (
        <div
          className="flex h-8 animate-pulse items-center gap-2 rounded-md px-2"
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items
          key={i}
        >
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-4 flex-1" style={{ width: widths[i] }} />
        </div>
      ))}
    </div>
  );
}

function ChatHistoryList({
  chats,
  loadMore,
  status,
}: {
  chats: Array<{ _id: string; title: string }> | undefined;
  loadMore: (numItems: number) => void;
  status: "CanLoadMore" | "LoadingMore" | "Exhausted" | "LoadingFirstPage";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const deleteChat = useMutation(api.chats.deleteChat);
  const [chatToDelete, setChatToDelete] = useState<{
    _id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!chatToDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteChat({ id: chatToDelete._id as Id<"chats"> });
      toast.success("Chat deleted");

      // If we're currently viewing the deleted chat, redirect to home
      if (pathname === `/chat/${chatToDelete._id}`) {
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to delete chat");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setChatToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-1">
        {chats?.map((chat) => (
          <div
            className="group relative flex w-full items-center rounded-lg transition-colors duration-150 hover:bg-accent"
            key={chat._id}
          >
            <button
              className="flex flex-1 items-center justify-start px-3 py-2 text-left text-xs"
              onClick={() => router.push(`/chat/${chat._id}`)}
              type="button"
            >
              <span className="truncate text-muted-foreground">
                {chat.title}
              </span>
            </button>
            <button
              className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-destructive hover:text-white group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setChatToDelete(chat);
              }}
              type="button"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Load More Indicator */}
      {status === "CanLoadMore" && (
        <button
          className="w-full py-2 text-muted-foreground text-xs transition-colors hover:text-foreground"
          onClick={() => loadMore(20)}
          type="button"
        >
          Load more
        </button>
      )}

      {status === "LoadingMore" && (
        <div className="py-2 text-muted-foreground text-xs">Loading...</div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog onOpenChange={() => setChatToDelete(null)} open={!!chatToDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isDeleting}
              onClick={() => setChatToDelete(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isDeleting}
              onClick={handleDelete}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ChatHistoryContent({
  isLoading,
  isAuthenticated,
  chats,
  loadMore,
  status,
}: {
  isLoading: boolean;
  isAuthenticated: boolean;
  chats: Array<{ _id: string; title: string }> | undefined;
  loadMore: (numItems: number) => void;
  status: "CanLoadMore" | "LoadingMore" | "Exhausted" | "LoadingFirstPage";
}) {
  if (isLoading) {
    return <ChatHistorySkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="px-3 py-2 text-muted-foreground text-xs">
        Sign in to see chat history
      </div>
    );
  }

  if (chats?.length === 0) {
    return (
      <div className="px-3 py-2 text-muted-foreground text-xs">
        No recent chats
      </div>
    );
  }

  return <ChatHistoryList chats={chats} loadMore={loadMore} status={status} />;
}

export function AppSidebar() {
  const router = useRouter();
  const { isOpen, isMobile, openMobile, setOpenMobile } = useSidebar();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const {
    results: chats,
    status,
    loadMore,
  } = usePaginatedQuery(
    // biome-ignore lint/suspicious/noExplicitAny: Convex query type issue with continueCursor
    api.chats.listChatsForUser as Parameters<typeof usePaginatedQuery>[0],
    {},
    { initialNumItems: 20 }
  );

  const sidebarContent = (
    <>
      {/* New Chat Button */}
      <button
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2 text-primary-foreground text-sm transition-colors duration-150 hover:bg-primary/90"
        onClick={() => {
          router.push("/");
          router.refresh();
        }}
        type="button"
      >
        <PlusIcon size={16} />
        New Chat
      </button>

      {/* Search Bar */}
      <div className="relative w-full rounded-lg bg-muted">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <SearchIcon className="text-muted-foreground" size={14} />
        </div>
        <input
          className="w-full rounded-lg bg-transparent py-2 pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:outline-none"
          placeholder="Search..."
          type="text"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pb-6">
        {/* Recent Section */}
        <div className="mt-2 mb-2">
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground text-sm transition-colors duration-150"
            type="button"
          >
            <ClockIcon size={14} />
            <span>Recent</span>
          </button>
        </div>

        {/* Chat History Items */}
        <ChatHistoryContent
          chats={chats}
          isAuthenticated={isAuthenticated}
          isLoading={isAuthLoading}
          loadMore={loadMore}
          status={status}
        />
      </nav>
    </>
  );

  // Mobile: render inside Sheet
  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile}>
        <SheetContent className="w-[272px] bg-background p-2" side="left">
          <SheetHeader className="flex flex-row items-center justify-between px-0 py-1">
            <SheetTitle className="px-2 text-h3 text-red-400">
              C Chat
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation and chat history
            </SheetDescription>
            <ThemeToggle />
          </SheetHeader>
          <div className="flex h-full flex-col gap-2">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: standard collapsible sidebar
  return (
    <div
      className="h-full shrink-0 overflow-hidden bg-background transition-[width] duration-200 ease-in-out"
      style={{ width: isOpen ? 272 : 0 }}
    >
      <div className="flex h-full w-[272px] flex-col gap-2 p-2">
        {sidebarContent}
      </div>
    </div>
  );
}

"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { notFound } from "next/navigation";
import { use } from "react";
import Chat from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { convertToUIMessages } from "@/lib/utils";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { id } = use(params);
  const chatId = id as Id<"chats">;

  // Convex batches queries over the same WebSocket connection
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );
  const chat = useQuery(
    api.chats.getChatById,
    isAuthenticated ? { chatId } : "skip"
  );
  const messages = useQuery(
    api.messages.getMessagesByChatId,
    isAuthenticated ? { chatId } : "skip"
  );

  if (isLoading || !chat || !messages || !currentUser) {
    return null;
  }
  if (currentUser._id !== chat.userId) {
    notFound();
  }

  return (
    <Chat
      id={chat._id}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialMessages={convertToUIMessages(messages)}
      initialVisibilityType={chat.visibility}
      isReadonly={false}
    />
  );
}

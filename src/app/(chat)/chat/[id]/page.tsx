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

  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );
  const chat = useQuery(api.chats.getChatById, { chatId: id as Id<"chats"> });
  const messages = useQuery(api.messages.getMessagesByChatId, {
    chatId: id as Id<"chats">,
  });

  if (isLoading || chat === undefined || messages === undefined) {
    return null;
  }
  if (currentUser === undefined) {
    return null;
  }
  if (!chat) {
    notFound();
  }

  if (!(isAuthenticated && currentUser) || currentUser._id !== chat.userId) {
    notFound();
  }

  const uiMessages = convertToUIMessages(
    messages.map((message) => ({
      _id: message._id,
      chatId: message.chatId,
      role: message.role,
      parts: message.parts,
      attachments: message.attachments,
      _creationTime: message._creationTime,
    }))
  );

  return (
    <Chat
      id={chat._id}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialMessages={uiMessages}
      initialVisibilityType={chat.visibility}
      isReadonly={currentUser._id !== chat.userId}
    />
  );
}

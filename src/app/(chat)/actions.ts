"use server";

import { gateway } from "@ai-sdk/gateway";
import { generateText, type UIMessage } from "ai";
import { fetchMutation } from "convex/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { VisibilityType } from "@/components/visibility-selector";
import { titlePrompt } from "@/lib/ai/prompt";
import { getToken } from "@/lib/auth-server";
import { getTextFromMessage } from "@/lib/utils";
import { api } from "../../../convex/_generated/api";

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: gateway("google/gemini-2.5-flash"),
    system: titlePrompt,
    prompt: getTextFromMessage(message),
  });

  return title;
}

export async function createNewChat(
  visibility: VisibilityType = "private"
): Promise<never> {
  const token = await getToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  const chatId = await fetchMutation(
    api.chats.saveChat,
    { title: "New Chat", visibility },
    { token }
  );

  redirect(`/chat/${chatId}`);
}

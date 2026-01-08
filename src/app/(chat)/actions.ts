"use server";

import { gateway } from "@ai-sdk/gateway";
import { generateText, type UIMessage } from "ai";
import { cookies } from "next/headers";
import { titlePrompt } from "@/lib/ai/prompt";
import { getTextFromMessage } from "@/lib/utils";

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

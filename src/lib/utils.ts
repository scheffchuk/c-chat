import type { UIMessage, UIMessagePart } from "ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Doc } from "../../convex/_generated/dataModel";
import { ChatSDKError, type ErrorCode } from "./errors";
import type { ChatMessage, CustomUIDataTypes } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTextFromMessage(message: ChatMessage | UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { type: "text"; text: string }).text)
    .join("");
}

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = await response.json();
      throw new ChatSDKError(code as ErrorCode, cause);
    }

    return response;
  } catch (error) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new Error("offline:chat");
    }

    throw error;
  }
}

export function sanitizedText(text: string | undefined | null) {
  if (!text) {
    return "";
  }
  return text.replace("<has_function_call>", "");
}

export function convertToUIMessages(
  messages: Doc<"messages">[]
): ChatMessage[] {
  return messages.map((message) => ({
    id: message._id,
    role: message.role as "user" | "assistant" | "system",
    parts: message.parts as UIMessagePart<CustomUIDataTypes, never>[],
    metadata: {
      createdAt: message._creationTime,
    },
  }));
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChatMessage } from "./types";
import { UIMessage } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTextFromMessage(message: ChatMessage | UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { type: "text"; text: string }).text)
    .join("");
}

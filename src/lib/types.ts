import type { UIMessage } from "ai";
import z from "zod";
import type { AppUsage } from "./usage";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.number(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

// Message part types matching AI SDK
// See: https://ai-sdk.dev/docs/reference/ai-sdk-core/ui-message
export type TextPart = { type: "text"; text: string };
export type ReasoningPart = { type: "reasoning"; text: string };
export type FilePart = {
  type: "file";
  mediaType: string;
  url: string;
  filename?: string;
};

// What we save to the database (subset of AI SDK parts)
// Route filters AI SDK parts down to just text/reasoning before saving
export type SavedMessagePart = TextPart | ReasoningPart;

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  // suggestionDelta: string;
  appendMessage: string;
  id: string;
  title: string;
  // kind: {ArtifactKind}
  clear: null;
  finish: null;
  usage: AppUsage;
  chatId: string;
};

// Full ChatMessage using AI SDK's UIMessage
// TODO: Add tool types for ChatMessage
export type ChatMessage = UIMessage<MessageMetadata, CustomUIDataTypes>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};

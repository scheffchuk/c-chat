import { UIMessage } from "ai";
import z from "zod";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.number(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

// TODO: ADD types for tools: Document, Suggestions

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
  // usage: AppUsage;
};

// TODO: Add tool types for ChatMessage
export type ChatMessage = UIMessage<MessageMetadata, CustomUIDataTypes>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};

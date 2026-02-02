import { v } from "convex/values";

export const chatValidator = v.object({
  _id: v.id("chats"),
  _creationTime: v.number(),
  userId: v.string(),
  title: v.string(),
  visibility: v.union(v.literal("public"), v.literal("private")),
  // Stores AppUsage from tokenlens - shape varies by provider
  lastContext: v.optional(v.any()),
});

// For saveMessages mutation args - the simplified parts we actually persist
// Route filters AI SDK parts down to just text/reasoning before saving
export const savedMessagePartValidator = v.union(
  v.object({ type: v.literal("text"), text: v.string() }),
  v.object({ type: v.literal("reasoning"), text: v.string() })
);

// messageValidator uses v.any() for parts/attachments because:
// - AI SDK UIMessagePart has dynamic types (e.g., 'tool-weatherTool')
// - Existing data may contain providerMetadata, state, and other fields
// - Schema must accept all historical data shapes
export const messageValidator = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  chatId: v.id("chats"),
  role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
  // AI SDK UIMessagePart types are extensible - see https://ai-sdk.dev/docs/reference/ai-sdk-core/ui-message
  parts: v.any(),
  // Attachments vary by type (documents, files, etc.)
  attachments: v.any(),
});

export const documentValidator = v.object({
  _id: v.id("documents"),
  _creationTime: v.number(),
  userId: v.string(),
  title: v.string(),
  content: v.optional(v.string()),
  kind: v.union(
    v.literal("text"),
    v.literal("code"),
    v.literal("image"),
    v.literal("sheet")
  ),
});

export const suggestionValidator = v.object({
  _id: v.id("suggestions"),
  _creationTime: v.number(),
  userId: v.string(),
  documentId: v.id("documents"),
  originalText: v.string(),
  suggestedText: v.string(),
  description: v.optional(v.string()),
  isResolved: v.boolean(),
});

export const streamValidator = v.object({
  _id: v.id("streams"),
  _creationTime: v.number(),
  streamId: v.string(),
  chatId: v.id("chats"),
});

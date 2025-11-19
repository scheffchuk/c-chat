import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  chats: defineTable({
    userId: v.id("users"),
    title: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
    lastContext: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  messages: defineTable({
    chatId: v.id("chats"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    parts: v.array(
      v.union(
        v.object({ type: v.literal("text"), text: v.string() }),
        v.object({
          type: v.literal("tool"),
          name: v.string(),
          args: v.object({}),
        })
      )
    ),
    attachments: v.array(
      v.object({ type: v.literal("document"), documentId: v.id("documents") })
    ),
  }).index("by_chatId", ["chatId"]),

  votes: defineTable({
    chatId: v.id("chats"),
    messageId: v.id("messages"),
    isUpvoted: v.boolean(),
  })
    .index("by_chatId_and_messageId", ["chatId", "messageId"])
    .index("by_messageId", ["messageId"]),

  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.optional(v.string()),
    kind: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("image"),
      v.literal("sheet")
    ),
  }).index("by_userId", ["userId"]),

  suggestions: defineTable({
    userId: v.id("users"),
    documentId: v.id("documents"),
    originalText: v.string(),
    suggestedText: v.string(),
    description: v.optional(v.string()),
    isResolved: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_documentId", ["documentId"]),

  streams: defineTable({
    chatId: v.id("chats"),
  }).index("by_chatId", ["chatId"]),
});

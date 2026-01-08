import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Note: Better Auth manages users in the component's "user" table
  // The app's tables reference Better Auth users via string IDs for flexibility
  chats: defineTable({
    userId: v.string(), // Better Auth user ID
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
    // parts should be an array of objects with the following shape, change this to any if it is not working.
    parts: v.any(),
    attachments: v.any(),
  }).index("by_chatId", ["chatId"]),

  documents: defineTable({
    userId: v.string(), // Better Auth user ID
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
    userId: v.string(), // Better Auth user ID
    documentId: v.id("documents"),
    originalText: v.string(),
    suggestedText: v.string(),
    description: v.optional(v.string()),
    isResolved: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_documentId", ["documentId"]),

  streams: defineTable({
    streamId: v.string(),
    chatId: v.id("chats"),
  })
    .index("by_chatId", ["chatId"])
    .index("by_streamId", ["streamId"]),
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  chats: defineTable({
    id: v.id("chats"),
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
    // visibility: v.enum("public", "private"),
    // lastContext: v.jsonb,
  }).index("by_user", ["userId"]),
  messages: defineTable({
    id: v.id("messages"),
    chatId: v.id("chats"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    parts: v.string(),
    createdAt: v.number(),
  }).index("by_chat", ["chatId"]),
});

// TODO: Add vote, document, suggestion tables
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMessagesByChatId = query({
  args: {
    chatId: v.id("chats"),
  },
  returns: v.array(
    v.object({
      id: v.id("messages"),
      chatId: v.id("chats"),
      userId: v.id("users"),
      role: v.union(
        v.literal("user"),
        v.literal("assistant"),
        v.literal("system")
      ),
      parts: v.string(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();
  },
});

export const saveMessages = mutation({
  args: {
    id: v.id("messages"),
    chatId: v.id("chats"),
    userId: v.id("users"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    parts: v.string(),
    createdAt: v.number(),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      id: args.id,
      chatId: args.chatId,
      userId: args.userId,
      role: args.role,
      parts: args.parts,
      createdAt: args.createdAt,
    });
  },
});

const getMessageById = query({
  args: {
    id: v.id("messages"),
  },
  returns: v.object({
    id: v.id("messages"),
    chatId: v.id("chats"),
    userId: v.id("users"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    parts: v.string(),
    createdAt: v.number(),
  }),
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }
    return message;
  },
});

export const deleteMessagesByChatIdAfterTimestamp = mutation({
  args: {
    chatId: v.id("chats"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .filter((q) => q.gt(q.field("createdAt"), args.timestamp))
      .collect();
    for (const message of messages) {
      await ctx.db.delete(message.id);
    }
  },
});

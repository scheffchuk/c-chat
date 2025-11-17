import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// TODO: Wrap them into QUERYS and MUTATIONS

export const getChatsByUserId = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(
    v.object({
      _id: v.id("chats"),
      _creationTime: v.number(),
      userId: v.id("users"),
      title: v.string(),
      visibility: v.union(v.literal("public"), v.literal("private")),
      lastContext: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) =>
    await ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect(),
});

export const getChatById = query({
  args: {
    chatId: v.id("chats"),
  },
  returns: v.object({
    _id: v.id("chats"),
    _creationTime: v.number(),
    userId: v.id("users"),
    title: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
    lastContext: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    return chat;
  },
});

export const saveChat = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
    lastContext: v.optional(v.string()),
  },
  returns: v.id("chats"),
  handler: async (ctx, args) => {
    const chatId = await ctx.db.insert("chats", {
      userId: args.userId,
      title: args.title,
      visibility: args.visibility,
      lastContext: args.lastContext,
    });

    return chatId;
  },
});

export const deleteChatById = mutation({
  args: {
    chatId: v.id("chats"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Delete messages
    for await (const message of ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))) {
      await ctx.db.delete(message._id);
    }
    // Delete votes (by chat)
    for await (const vote of ctx.db
      .query("votes")
      .withIndex("by_chatId_and_messageId", (q) =>
        q.eq("chatId", args.chatId)
      )) {
      await ctx.db.delete(vote._id);
    }
    // Delete streams
    for await (const stream of ctx.db
      .query("streams")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))) {
      await ctx.db.delete(stream._id);
    }
    // Delete chat
    await ctx.db.delete(args.chatId);
    return null;
  },
});

export const updateChatContextById = mutation({
  args: {
    chatId: v.id("chats"),
    lastContext: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chatId, {
      lastContext: args.lastContext,
    });
    return null;
  },
});

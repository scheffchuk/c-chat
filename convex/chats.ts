import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// TODO: Wrap them into QUERYS and MUTATIONS 

export const getChatsByUserId = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(
    v.object({
      id: v.id("chats"),
      userId: v.id("users"),
      title: v.string(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getChatById = query({
  args: {
    id: v.id("chats"),
  },
  returns: v.object({
    id: v.id("chats"),
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
  }),
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);
    if (!chat) {
      throw new Error("Chat not found");
    }
    return chat;
  },
});

export const saveChat = mutation({
  args: {
    id: v.id("chats"),
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
  },
  returns: v.id("chats"),
  handler: async (ctx, args) => {
    const chatId = await ctx.db.insert("chats", {
      id: args.id,
      userId: args.userId,
      title: args.title,
      createdAt: Date.now(),
    });

    return chatId;
  },
});

export const deleteChatById = mutation({
  args: {
    id: v.id("chats"),
    messageIds: v.array(v.id("messages")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    for (const messageId of args.messageIds) {
      await ctx.db.delete(messageId);
    }
    return null;
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent, getAuthenticatedUser } from "./auth";

export const saveChat = mutation({
  args: {
    title: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    return await ctx.db.insert("chats", {
      userId: user._id,
      title: args.title,
      visibility: args.visibility,
      lastContext: undefined,
    });
  },
});

export const getChatById = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => await ctx.db.get(args.chatId),
});

export const getChatByIdForUser = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    if (chat.visibility === "private" && chat.userId !== user._id) {
      throw new Error("Forbidden");
    }

    return chat;
  },
});

export const listChatsForUser = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.id("chats")),
  },
  handler: async (ctx, args) => {
    let user;
    try {
      user = await authComponent.getAuthUser(ctx);
    } catch {
      return { chats: [], hasMore: false };
    }
    if (!user) {
      return { chats: [], hasMore: false };
    }

    const limit = args.limit ?? 20;
    let listQuery = ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc");

    if (args.cursor) {
      const cursorChat = await ctx.db.get(args.cursor);
      if (cursorChat) {
        listQuery = ctx.db
          .query("chats")
          .withIndex("by_userId", (q) =>
            q
              .eq("userId", user._id)
              .lt("_creationTime", cursorChat._creationTime)
          )
          .order("desc");
      }
    }

    const chats = await listQuery.take(limit + 1);
    const hasMore = chats.length > limit;
    return {
      chats: hasMore ? chats.slice(0, limit) : chats,
      hasMore,
    };
  },
});

export const deleteChat = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const chat = await ctx.db.get(args.id);

    if (!chat || chat.userId !== user._id) {
      throw new Error("Not found or forbidden");
    }

    // Delete related messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.id))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete related streams
    const streams = await ctx.db
      .query("streams")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.id))
      .collect();

    for (const stream of streams) {
      await ctx.db.delete(stream._id);
    }

    await ctx.db.delete(args.id);
    return null;
  },
});

export const deleteAllChatsForUser = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    // Delete all chats
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    let deleteCount = 0;
    for (const chat of chats) {
      // Delete related messages
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
        .collect();

      for (const message of messages) {
        await ctx.db.delete(message._id);
      }

      // Delete related streams
      const streams = await ctx.db
        .query("streams")
        .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
        .collect();

      for (const stream of streams) {
        await ctx.db.delete(stream._id);
      }

      await ctx.db.delete(chat._id);
      deleteCount += 1;
    }

    return { deleteCount };
  },
});

export const updateVisibility = mutation({
  args: {
    id: v.id("chats"),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const chat = await ctx.db.get(args.id);

    if (!chat || chat.userId !== user._id) {
      throw new Error("Not found or forbidden");
    }

    await ctx.db.patch(args.id, {
      visibility: args.visibility,
    });
  },
});

export const updateLastContext = mutation({
  args: {
    id: v.id("chats"),
    context: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const chat = await ctx.db.get(args.id);

    if (!chat || chat.userId !== user._id) {
      throw new Error("Not found or forbidden");
    }

    await ctx.db.patch(args.id, {
      lastContext: args.context,
    });
  },
});

export const updateTitle = mutation({
  args: {
    id: v.id("chats"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const chat = await ctx.db.get(args.id);

    if (!chat || chat.userId !== user._id) {
      throw new Error("Not found or forbidden");
    }

    await ctx.db.patch(args.id, {
      title: args.title,
    });
  },
});

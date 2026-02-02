import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth, getAuthenticatedUser } from "./auth";
import { chatValidator } from "./validators";

export const saveChat = mutation({
  args: {
    title: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
    selectedModelId: v.optional(v.string()),
  },
  returns: v.id("chats"),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    return await ctx.db.insert("chats", {
      userId: user._id,
      title: args.title,
      visibility: args.visibility,
      lastContext: undefined,
      selectedModelId: args.selectedModelId,
    });
  },
});

export const getChatById = query({
  args: {
    chatId: v.id("chats"),
  },
  returns: v.union(chatValidator, v.null()),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      return null;
    }
    // Allow public chats or owned chats
    if (chat.visibility === "private" && chat.userId !== userId) {
      return null;
    }
    return chat;
  },
});

export const getChatByIdForUser = query({
  args: { chatId: v.id("chats") },
  returns: chatValidator,
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
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    page: v.array(chatValidator),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: null };
    }

    return await ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const deleteChat = mutation({
  args: { id: v.id("chats") },
  returns: v.null(),
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
  returns: v.object({
    deleteCount: v.number(),
  }),
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
  returns: v.null(),
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
  returns: v.null(),
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
  returns: v.null(),
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

export const updateSelectedModel = mutation({
  args: {
    id: v.id("chats"),
    selectedModelId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const chat = await ctx.db.get(args.id);

    if (!chat || chat.userId !== user._id) {
      throw new Error("Not found or forbidden");
    }

    await ctx.db.patch(args.id, {
      selectedModelId: args.selectedModelId,
    });
  },
});

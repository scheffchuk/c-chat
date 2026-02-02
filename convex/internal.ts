import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internalMutation, internalQuery } from "./_generated/server";
import {
  chatValidator,
  documentValidator,
  messageValidator,
  savedMessagePartValidator,
  suggestionValidator,
} from "./validators";

// Internal mutations that can be called from HTTP actions without authentication
export const createChat = internalMutation({
  args: {
    title: v.string(),
    userId: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  returns: v.id("chats"),
  handler: async (ctx, args) =>
    await ctx.db.insert("chats", {
      title: args.title,
      userId: args.userId,
      visibility: args.visibility,
      lastContext: undefined,
    }),
});

export const internalGetChatById = internalQuery({
  args: {
    chatId: v.id("chats"),
  },
  returns: chatValidator,
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    return chat;
  },
});

export const internalGetMessagesByChatId = internalQuery({
  args: {
    chatId: v.id("chats"),
  },
  returns: v.array(messageValidator),
  handler: async (ctx, args) =>
    await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect(),
});

export const internalSaveMessages = internalMutation({
  args: {
    messages: v.array(
      v.object({
        chatId: v.id("chats"),
        role: v.union(
          v.literal("user"),
          v.literal("assistant"),
          v.literal("system")
        ),
        parts: v.array(savedMessagePartValidator),
        // Attachments can vary (document refs, file metadata, etc.)
        // Using v.any() for flexibility with different attachment shapes.
        attachments: v.any(),
      })
    ),
  },
  returns: v.array(v.id("messages")),
  handler: async (ctx, args) => {
    if (args.messages.length > 100) {
      throw new Error("Cannot save more than 100 messages at once");
    }

    const insertedIds: Id<"messages">[] = [];

    for (const message of args.messages) {
      const id = await ctx.db.insert("messages", message);
      insertedIds.push(id);
    }
    return insertedIds;
  },
});

export const createStream = internalMutation({
  args: {
    streamId: v.string(),
    chatId: v.id("chats"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("streams", {
      streamId: args.streamId,
      chatId: args.chatId,
    });
  },
});

export const updateChatLastContext = internalMutation({
  args: {
    chatId: v.id("chats"),
    // Stores AppUsage from tokenlens - shape varies by provider
    context: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chatId, {
      lastContext: args.context,
    });
  },
});

export const deleteChat = internalMutation({
  args: {
    chatId: v.id("chats"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    // Delete related messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete related streams
    const streams = await ctx.db
      .query("streams")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();
    for (const stream of streams) {
      await ctx.db.delete(stream._id);
    }

    await ctx.db.delete(args.chatId);
    return null;
  },
});

export const getMessageCountByUserId = internalQuery({
  args: {
    userId: v.string(),
    differenceInHours: v.number(),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    const cutOffTime = Date.now() - args.differenceInHours * 60 * 60 * 1000;

    // Get user's chats
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    let count = 0;
    for (const chat of chats) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_chatId", (q) =>
          q.eq("chatId", chat._id).gte("_creationTime", cutOffTime)
        )
        .collect();
      count += messages.filter((m) => m.role === "user").length;
    }
    return count;
  },
});

export const saveDocument = internalMutation({
  args: {
    title: v.string(),
    kind: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("image"),
      v.literal("sheet")
    ),
    content: v.string(),
    userId: v.string(),
  },
  returns: v.id("documents"),
  handler: async (ctx, args) =>
    await ctx.db.insert("documents", {
      title: args.title,
      kind: args.kind,
      content: args.content,
      userId: args.userId,
    }),
});

export const internalGetDocumentById = internalQuery({
  args: {
    documentId: v.id("documents"),
  },
  returns: v.union(documentValidator, v.null()),
  handler: async (ctx, args) => await ctx.db.get(args.documentId),
});

export const deleteDocumentsAfterTimestamp = internalMutation({
  args: {
    documentId: v.id("documents"),
    timestamp: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    const suggestions = await ctx.db
      .query("suggestions")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const suggestion of suggestions) {
      if (suggestion._creationTime > args.timestamp) {
        await ctx.db.delete(suggestion._id);
      }
    }

    if (document._creationTime > args.timestamp) {
      await ctx.db.delete(document._id);
    }

    return null;
  },
});

export const saveSuggestions = internalMutation({
  args: {
    suggestions: v.array(
      v.object({
        userId: v.string(),
        documentId: v.id("documents"),
        originalText: v.string(),
        suggestedText: v.string(),
        description: v.optional(v.string()),
        isResolved: v.boolean(),
      })
    ),
  },
  returns: v.array(v.id("suggestions")),
  handler: async (ctx, args) => {
    if (args.suggestions.length > 100) {
      throw new Error("Cannot save more than 100 suggestions at once");
    }

    const insertedIds: Id<"suggestions">[] = [];

    for (const suggestion of args.suggestions) {
      const id = await ctx.db.insert("suggestions", suggestion);
      insertedIds.push(id);
    }
    return insertedIds;
  },
});

export const internalGetSuggestionsByDocumentId = internalQuery({
  args: {
    documentId: v.id("documents"),
  },
  returns: v.array(suggestionValidator),
  handler: async (ctx, args) =>
    await ctx.db
      .query("suggestions")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .collect(),
});

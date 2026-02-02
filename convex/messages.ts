import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { auth, getAuthenticatedUser } from "./auth";
import { messageValidator, savedMessagePartValidator } from "./validators";

export const saveMessages = mutation({
  args: {
    messages: v.array(
      v.object({
        id: v.optional(v.string()),
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
    await getAuthenticatedUser(ctx);

    if (args.messages.length > 100) {
      throw new Error("Cannot save more than 100 messages at once");
    }

    const insertedIds: Id<"messages">[] = [];

    for (const message of args.messages) {
      const id = await ctx.db.insert("messages", {
        chatId: message.chatId,
        role: message.role,
        parts: message.parts,
        attachments: message.attachments,
      });
      insertedIds.push(id);
    }
    return insertedIds;
  },
});

export const getMessagesByChatId = query({
  args: {
    chatId: v.id("chats"),
  },
  returns: v.array(messageValidator),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      return [];
    }
    // Check visibility - only allow if public or user owns it
    if (chat.visibility === "private" && chat.userId !== userId) {
      return [];
    }
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
    return messages;
  },
});

export const getMessageById = query({
  args: {
    id: v.id("messages"),
  },
  returns: v.union(messageValidator, v.null()),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const message = await ctx.db.get(args.id);
    if (!message) {
      return null;
    }
    // Check chat visibility
    const chat = await ctx.db.get(message.chatId);
    if (!chat) {
      return null;
    }
    if (chat.visibility === "private" && chat.userId !== userId) {
      return null;
    }
    return message;
  },
});

export const deleteMessageAfterTimestamp = mutation({
  args: {
    chatId: v.id("chats"),
    timestamp: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) =>
        q.eq("chatId", args.chatId).gte("_creationTime", args.timestamp)
      )
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});

export const deleteTrailingMessages = mutation({
  args: {
    id: v.id("messages"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }

    // Delete this message and all messages after it in the same chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) =>
        q
          .eq("chatId", message.chatId)
          .gte("_creationTime", message._creationTime)
      )
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});

export const MessageCountByUserIdInHours = query({
  args: {
    differenceInHours: v.number(),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const cutOffTime = Date.now() - args.differenceInHours * 60 * 60 * 1000;

    // Get user's chats
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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

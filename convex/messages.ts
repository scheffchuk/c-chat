import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./auth";

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
        parts: v.any(),
        attachments: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

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
  handler: async (ctx, args) => {
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
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }
    return message;
  },
});

export const deleteMessageAfterTimestamp = mutation({
  args: {
    chatId: v.id("chats"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    const toDelete = messages.filter((m) => m._creationTime >= args.timestamp);

    for (const message of toDelete) {
      await ctx.db.delete(message._id);
    }
  },
});

export const deleteTrailingMessages = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }

    // Delete this message and all messages after it in the same chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", message.chatId))
      .collect();

    const toDelete = messages.filter(
      (m) => m._creationTime >= message._creationTime
    );

    for (const msg of toDelete) {
      await ctx.db.delete(msg._id);
    }
  },
});

export const MessageCountByUserIdInHours = query({
  args: {
    differenceInHours: v.number(),
  },
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
        .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
        .collect();
      count += messages.filter(
        (m) => m._creationTime >= cutOffTime && m.role === "user"
      ).length;
    }
    return count;
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const partValidator = v.union(
  v.object({ type: v.literal("text"), text: v.string() }),
  v.object({ type: v.literal("tool"), name: v.string(), args: v.object({}) })
);

const attachmentValidator = v.object({
  type: v.literal("document"),
  documentId: v.id("documents"),
});

const messageReturnValidator = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  chatId: v.id("chats"),
  role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
  parts: v.array(partValidator),
  attachments: v.array(attachmentValidator),
});

export const getMessagesByChatId = query({
  args: {
    chatId: v.id("chats"),
  },
  returns: v.array(messageReturnValidator),
  handler: async (ctx, args) =>
    await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect(),
});

export const saveMessages = mutation({
  args: {
    chatId: v.id("chats"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    parts: v.array(partValidator),
    attachments: v.array(attachmentValidator),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) =>
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: args.role,
      parts: args.parts,
      attachments: args.attachments,
    }),
});

export const getMessageById = query({
  args: {
    messageId: v.id("messages"),
  },
  returns: messageReturnValidator,
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
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
  returns: v.null(),
  handler: async (ctx, args) => {
    for await (const message of ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))) {
      if (message._creationTime > args.timestamp) {
        await ctx.db.delete(message._id);
      }
    }
    return null;
  },
});

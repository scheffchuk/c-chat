import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./auth";

export const createStream = mutation({
  args: {
    streamId: v.string(),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    await ctx.db.insert("streams", {
      streamId: args.streamId,
      chatId: args.chatId,
    });
  },
});

export const getStreamByChatId = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const streams = await ctx.db
      .query("streams")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
    return streams.map((stream) => stream.streamId);
  },
});

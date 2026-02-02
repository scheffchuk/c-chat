import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./auth";

export const createStream = mutation({
  args: {
    streamId: v.string(),
    chatId: v.id("chats"),
  },
  returns: v.null(),
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
  returns: v.array(v.string()),
  handler: async (ctx, args) => {
    const streams = await ctx.db
      .query("streams")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
    return streams.map((stream) => stream.streamId);
  },
});

export const deleteStream = mutation({
  args: {
    streamId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const streams = await ctx.db
      .query("streams")
      .withIndex("by_streamId", (q) => q.eq("streamId", args.streamId))
      .collect();

    for (const stream of streams) {
      await ctx.db.delete(stream._id);
    }
  },
});

export const cleanupOldStreams = mutation({
  args: {
    olderThanHours: v.number(),
  },
  returns: v.object({
    deletedCount: v.number(),
  }),
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const cutOffTime = Date.now() - args.olderThanHours * 60 * 60 * 1000;
    const streams = await ctx.db.query("streams").collect();

    let deletedCount = 0;
    for (const stream of streams) {
      if (stream._creationTime < cutOffTime) {
        await ctx.db.delete(stream._id);
        deletedCount += 1;
      }
    }

    return { deletedCount };
  },
});

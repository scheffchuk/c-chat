import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./auth";

export const saveSuggestions = mutation({
  args: {
    suggestion: v.array(
      v.object({
        documentId: v.id("documents"),
        originalText: v.string(),
        suggestedText: v.string(),
        description: v.optional(v.string()),
        isResolved: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const insertedIds: Id<"suggestions">[] = [];

    for (const suggestion of args.suggestion) {
      const id = await ctx.db.insert("suggestions", {
        ...suggestion,
        userId: user._id,
      });
      insertedIds.push(id);
    }

    return insertedIds;
  },
});

export const getSuggestionsByDocumentId = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) =>
    await ctx.db
      .query("suggestions")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .collect(),
});

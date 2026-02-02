import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { auth, getAuthenticatedUser } from "./auth";
import { suggestionValidator } from "./validators";

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
  returns: v.array(v.id("suggestions")),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (args.suggestion.length > 100) {
      throw new Error("Cannot save more than 100 suggestions at once");
    }

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
  returns: v.array(suggestionValidator),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      return [];
    }
    // Only allow users to access suggestions for their own documents
    if (document.userId !== userId) {
      return [];
    }
    return await ctx.db
      .query("suggestions")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

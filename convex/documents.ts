import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth, getAuthenticatedUser } from "./auth";
import { documentValidator } from "./validators";

export const saveDocument = mutation({
  args: {
    title: v.string(),
    kind: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("image"),
      v.literal("sheet")
    ),
    content: v.string(),
  },
  returns: v.id("documents"),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      kind: args.kind,
      content: args.content,
      userId: user._id,
    });

    return documentId;
  },
});

export const getDocumentById = query({
  args: {
    documentId: v.id("documents"),
  },
  returns: v.union(documentValidator, v.null()),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      return null;
    }
    // Only allow users to access their own documents
    if (document.userId !== userId) {
      return null;
    }
    return document;
  },
});

export const getAllDocumentsById = query({
  args: {
    documentId: v.id("documents"),
  },
  returns: v.array(documentValidator),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      return [];
    }
    // Only allow users to access their own documents
    if (document.userId !== userId) {
      return [];
    }
    return [document];
  },
});

export const deleteDocumentAfterTimestamp = mutation({
  args: {
    documentId: v.id("documents"),
    timestamp: v.number(),
  },
  returns: v.array(documentValidator),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    if (document.userId !== user._id) {
      throw new Error("Forbidden");
    }

    // Delete all suggestions for this document
    const suggestions = await ctx.db
      .query("suggestions")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const suggestion of suggestions) {
      if (suggestion._creationTime > args.timestamp) {
        await ctx.db.delete(suggestion._id);
      }
    }

    // In Convex, we don't have versioned documents by timestamp in the same way
    // We just delete the document if it was created after the timestamp
    if (document._creationTime > args.timestamp) {
      await ctx.db.delete(document._id);
      return [document];
    }

    return [];
  },
});

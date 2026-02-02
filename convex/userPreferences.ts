import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./auth";

export const getPreferences = query({
  args: {},
  returns: v.union(
    v.object({
      favoriteModels: v.optional(v.array(v.string())),
      selectedModelId: v.optional(v.string()),
      reasoningEffort: v.optional(
        v.union(
          v.literal("none"),
          v.literal("low"),
          v.literal("medium"),
          v.literal("high")
        )
      ),
      maxSteps: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    const userId = String(user._id);

    const prefs = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!prefs) {
      return null;
    }

    return {
      favoriteModels: prefs.favoriteModels,
      selectedModelId: prefs.selectedModelId,
      reasoningEffort: prefs.reasoningEffort,
      maxSteps: prefs.maxSteps,
    };
  },
});

export const getFavoriteModels = query({
  args: {},
  returns: v.union(v.array(v.string()), v.null()),
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    const userId = String(user._id);

    const prefs = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return prefs?.favoriteModels ?? null;
  },
});

async function getOrCreatePreferences(
  ctx: MutationCtx,
  userId: string
): Promise<Doc<"userPreferences">> {
  const existing = await ctx.db
    .query("userPreferences")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  if (existing) {
    return existing;
  }

  const id = await ctx.db.insert("userPreferences", { userId });

  const created = await ctx.db.get(id);
  if (!created) {
    throw new Error("Failed to create preferences");
  }
  return created;
}

export const toggleFavoriteModel = mutation({
  args: {
    modelId: v.string(),
  },
  returns: v.object({
    isFavorite: v.boolean(),
    favorites: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const userId = String(user._id);

    const prefs = await getOrCreatePreferences(ctx, userId);
    if (!prefs) {
      throw new Error("Failed to get or create preferences");
    }

    const currentFavorites = prefs.favoriteModels ?? [];
    const isFavorite = currentFavorites.includes(args.modelId);

    const newFavorites = isFavorite
      ? currentFavorites.filter((id) => id !== args.modelId)
      : [...currentFavorites, args.modelId];

    await ctx.db.patch(prefs._id, {
      favoriteModels: newFavorites,
    });

    return {
      isFavorite: !isFavorite,
      favorites: newFavorites,
    };
  },
});

export const setFavoriteModels = mutation({
  args: {
    modelIds: v.array(v.string()),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const userId = String(user._id);

    const prefs = await getOrCreatePreferences(ctx, userId);
    if (!prefs) {
      throw new Error("Failed to get or create preferences");
    }

    await ctx.db.patch(prefs._id, {
      favoriteModels: args.modelIds,
    });

    return { success: true };
  },
});

export const updatePreferences = mutation({
  args: {
    selectedModelId: v.optional(v.string()),
    reasoningEffort: v.optional(
      v.union(
        v.literal("none"),
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      )
    ),
    maxSteps: v.optional(v.number()),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const userId = String(user._id);

    const prefs = await getOrCreatePreferences(ctx, userId);
    if (!prefs) {
      throw new Error("Failed to get or create preferences");
    }

    await ctx.db.patch(prefs._id, {
      selectedModelId: args.selectedModelId,
      reasoningEffort: args.reasoningEffort,
      maxSteps: args.maxSteps,
    });

    return { success: true };
  },
});

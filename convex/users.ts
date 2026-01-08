import { query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Get the current authenticated user from Better Auth.
 * This is the single source of truth for user data in Convex functions.
 * Returns null if not authenticated.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => authComponent.getAuthUser(ctx),
});

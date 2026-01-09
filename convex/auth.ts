import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google,
    Resend({
      from: process.env.AUTH_EMAIL_FROM ?? "noreply@example.com",
    }),
  ],
});

// Auth error class
export class AuthenticationError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
  }
}

// Helper to get authenticated user - throws if not authenticated
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) {
    throw new AuthenticationError();
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
}

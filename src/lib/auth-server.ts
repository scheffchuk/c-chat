import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

const authUtils = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL as string,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL as string,
});

// Re-export all utilities
export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = authUtils;

/**
 * Get auth context for API routes - single function for all auth needs.
 * Returns token if authenticated, null otherwise.
 */
export async function getAuthContext() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return null;
  }
  const token = await getToken();
  return token;
}

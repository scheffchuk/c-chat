import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

/**
 * Get auth token for server-side Convex calls.
 * Returns token if authenticated, undefined otherwise.
 */
export async function getToken() {
  return await convexAuthNextjsToken();
}

import {
  convexAuthNextjsMiddleware,
  convexAuthNextjsToken,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher(["/signin", "/signup"]);

export const authMiddleware = convexAuthNextjsMiddleware(async (request) => {
  // Allow public routes
  if (isPublicRoute(request)) {
    return;
  }

  // Redirect unauthenticated users to signin
  if (!(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }
});

/**
 * Get auth token for server-side Convex calls.
 * Returns token if authenticated, undefined otherwise.
 */
export async function getToken() {
  return await convexAuthNextjsToken();
}

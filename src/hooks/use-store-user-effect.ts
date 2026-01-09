import { useConvexAuth } from "convex/react";

/**
 * @deprecated Use `useAuth` from `@/lib/auth-client` or `useConvexAuth` directly.
 * Kept for backwards compatibility during migration.
 */
export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return { isLoading, isAuthenticated };
}

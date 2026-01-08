import { useAuth } from "@/lib/auth-client";

/**
 * @deprecated Use `useAuth` from `@/lib/auth-client` directly.
 * Kept for backwards compatibility during migration.
 */
export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useAuth();
  return { isLoading, isAuthenticated };
}

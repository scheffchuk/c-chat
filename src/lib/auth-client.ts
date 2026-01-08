import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [convexClient()],
});

// Re-export auth methods as single source of truth
export const { signIn, signOut, signUp, useSession } = authClient;

// Derived auth state hook - single source of truth for client components
export function useAuth() {
  const { data: session, isPending, error } = useSession();

  return {
    user: session?.user ?? null,
    session,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    error,
  };
}

"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Re-export auth actions hook
export { useAuthActions };

// Auth state hook - single source of truth for client components
export function useAuth() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );

  return {
    user: user ?? null,
    isLoading: isLoading || (isAuthenticated && user === undefined),
    isAuthenticated,
  };
}

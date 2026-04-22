"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface AuthUser {
  id: string;
}

export interface AuthProfile {
  display_name: string;
}

interface UseAuthResult {
  user: AuthUser | null;
  profile: AuthProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut: convexSignOut } = useAuthActions();
  const current = useQuery(
    api.profiles.current,
    isAuthenticated ? {} : "skip",
  );

  const loading = isLoading || (isAuthenticated && current === undefined);

  const user: AuthUser | null = current ? { id: current.id } : null;
  const profile: AuthProfile | null = current?.displayName
    ? { display_name: current.displayName }
    : null;

  return {
    user,
    profile,
    loading,
    signOut: async () => {
      await convexSignOut();
    },
  };
}

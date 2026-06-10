"use client";

import React, { useEffect } from "react";
import { useMeQuery } from "@/services/api/auth/auth-api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setLoading, logout } from "@/store/features/auth/auth.slice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  // Initialize from localStorage on mount (client-only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cachedUserStr = localStorage.getItem("user");
        if (cachedUserStr) {
          const cachedUser = JSON.parse(cachedUserStr);
          console.debug("AuthProvider: Hydrated cached session from localStorage", cachedUser);
          dispatch(setCredentials(cachedUser));
        } else {
          dispatch(setLoading(true)); // No cache, show loader until verified
        }
      } catch (e) {
        console.error("AuthProvider: Failed to load cached session", e);
        dispatch(setLoading(true));
      }
    }
  }, [dispatch]);

  // Run verification query ONLY in browser after mount
  const { data, error } = useMeQuery(undefined, {
    skip: typeof window === "undefined",
    refetchOnMountOrArgChange: true,
  });

  // Revalidate session once query completes
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (data?.success && data?.data) {
      console.debug("AuthProvider: Background verification success. Syncing credentials", data.data);
      dispatch(setCredentials(data.data));
    } else if (error) {
      console.warn("AuthProvider: Background verification failed (expired/revoked session). Clearing cache", error);
      dispatch(logout());
    }
  }, [data, error, dispatch]);

  return <>{children}</>;
}

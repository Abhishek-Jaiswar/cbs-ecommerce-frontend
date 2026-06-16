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
          dispatch(setCredentials(cachedUser));
        } else {
          dispatch(setLoading(true)); // No cache, show loader until verified
        }
      } catch (e) {
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
      dispatch(setCredentials(data.data));
    } else if (error) {
      dispatch(logout());
    }
  }, [data, error, dispatch]);

  return <>{children}</>;
}

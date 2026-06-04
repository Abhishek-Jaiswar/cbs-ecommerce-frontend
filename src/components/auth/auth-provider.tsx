"use client";

import React, { useEffect } from "react";
import { useMeQuery } from "@/services/api/auth/auth-api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setLoading } from "@/store/features/auth/auth.slice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching } = useMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    dispatch(setLoading(isLoading || isFetching));
  }, [isLoading, isFetching, dispatch]);

  useEffect(() => {
    if (data?.success && data?.data) {
      dispatch(setCredentials(data.data));
    } else if (!isLoading && !isFetching) {
      // Done loading, but no valid session (e.g. 401 or no cookie)
      dispatch(setLoading(false));
    }
  }, [data, isLoading, isFetching, dispatch]);

  return <>{children}</>;
}

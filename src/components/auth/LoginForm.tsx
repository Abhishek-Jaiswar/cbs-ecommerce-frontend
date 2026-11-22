"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useLoginMutation } from "@/services/api/auth/auth-api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/auth.slice";
import {
  AuthAlert,
  AuthButton,
  AuthField,
  AuthShell,
  PasswordField,
  safeRedirect,
  useRedirectIfSignedIn,
  withRedirect,
} from "./auth-ui";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // ?redirect=/shop/some-product brings shoppers back where they were
  const redirect = safeRedirect(useSearchParams().get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const [signingIn, setSigningIn] = useState(false);
  const leaving = useRedirectIfSignedIn(redirect, signingIn);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setSigningIn(true);
    try {
      const res = await login({ email: email.trim(), password }).unwrap();

      if (res.success && res.data) {
        dispatch(setCredentials(res.data));
        router.push(
          res.data.role === "ADMIN" ? "/dashboard" : (redirect ?? "/"),
        );
      } else {
        setSigningIn(false);
        setErrorMessage(res.message || "Failed to log in.");
      }
    } catch (error: unknown) {
      setSigningIn(false);
      const err = error as {
        status?: number | string;
        data?: { message?: string };
      };
      setErrorMessage(
        err?.status === "FETCH_ERROR"
          ? "We couldn’t reach the server. Please check your connection and try again."
          : err?.data?.message ||
              "Failed to log in. Please check your email and password.",
      );
    }
  };

  // already signed in: show nothing while we send them on
  if (leaving) return <main className="min-h-svh flex-1 bg-white" />;

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign In"
      intro="Sign in to see your orders, favourites and saved addresses."
      footer={
        <>
          New to ZenVoraa?{" "}
          <Link
            href={withRedirect("/signup", redirect)}
            className="text-zv-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      {errorMessage && <AuthAlert tone="error">{errorMessage}</AuthAlert>}

      <form onSubmit={onSubmit} className="flex flex-col gap-zv-20" noValidate>
        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelAside={
            <Link
              href="/forgot-password"
              className="type-caption text-zv-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          }
        />
        <AuthButton loading={isLoading} className="mt-zv-10">
          {isLoading ? "Signing In…" : "Sign In"}
        </AuthButton>
      </form>
    </AuthShell>
  );
}

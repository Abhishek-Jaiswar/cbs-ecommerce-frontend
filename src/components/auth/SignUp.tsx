"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  useRegisterMutation,
  useVerifyEmailOtpMutation,
  useRequestEmailOtpMutation,
} from "@/services/api/auth/auth-api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/auth.slice";
import {
  AuthAlert,
  AuthButton,
  AuthField,
  AuthShell,
  OtpField,
  PasswordField,
  TextButton,
  safeRedirect,
  withRedirect,
} from "./auth-ui";

type Status = { type: "success" | "error"; text: string } | null;
const RESEND_SECONDS = 60;
const errorText = (error: unknown, fallback: string) =>
  (error as { data?: { message?: string } })?.data?.message || fallback;

export default function SignupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const redirect = safeRedirect(useSearchParams().get("redirect"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isRegistered, setIsRegistered] = useState(false);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [cooldown, setCooldown] = useState(0);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailOtpMutation();
  const [requestOtp, { isLoading: isResending }] = useRequestEmailOtpMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim() || !email.trim() || !password) {
      setStatus({ type: "error", text: "Please fill in your name, email and a password." });
      return;
    }
    if (password.length < 8) {
      setStatus({ type: "error", text: "Your password needs at least 8 characters." });
      return;
    }

    try {
      const res = await register({ name: name.trim(), email: email.trim(), password }).unwrap();
      if (res.success) {
        setIsRegistered(true);
        setCooldown(RESEND_SECONDS);
        setStatus({ type: "success", text: `We’ve sent a 6-digit code to ${email.trim()}.` });
      } else {
        setStatus({ type: "error", text: res.message || "Failed to create account." });
      }
    } catch (error: unknown) {
      setStatus({ type: "error", text: errorText(error, "Failed to create account. Please try again.") });
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (otp.length !== 6) {
      setStatus({ type: "error", text: "Please enter the 6-digit code from your email." });
      return;
    }

    try {
      const res = await verifyEmail({ email: email.trim(), otp }).unwrap();
      if (res.success && res.data) {
        const user = res.data;
        dispatch(setCredentials(user));
        setStatus({ type: "success", text: "Email verified! Signing you in…" });
        setTimeout(() => router.push(user.role === "ADMIN" ? "/dashboard" : (redirect ?? "/")), 1200);
      } else {
        setStatus({ type: "error", text: res.message || "Invalid or expired code." });
      }
    } catch (error: unknown) {
      setStatus({ type: "error", text: errorText(error, "Invalid code. Please try again.") });
    }
  };

  const onResendOtp = async () => {
    if (cooldown > 0) return;
    setStatus(null);
    try {
      const res = await requestOtp({ email: email.trim() }).unwrap();
      if (res.success) {
        setCooldown(RESEND_SECONDS);
        setStatus({ type: "success", text: "A new code is on its way." });
      }
    } catch (error: unknown) {
      setStatus({ type: "error", text: errorText(error, "Failed to send the code. Try again later.") });
    }
  };

  const signInLink = (
    <>
      Already have an account?{" "}
      <Link href={withRedirect("/login", redirect)} className="text-zv-primary underline-offset-4 hover:underline">
        Sign in
      </Link>
    </>
  );

  if (isRegistered) {
    return (
      <AuthShell
        eyebrow="Almost there"
        title="Verify Your Email"
        intro={
          <>
            Enter the code we sent to <span className="text-zv-ink">{email.trim()}</span>. It may take a minute to arrive.
          </>
        }
        footer={signInLink}
      >
        {status && <AuthAlert tone={status.type}>{status.text}</AuthAlert>}
        <form onSubmit={onVerifyOtp} className="flex flex-col gap-zv-20" noValidate>
          <OtpField value={otp} onChange={setOtp} />
          <AuthButton loading={isVerifying}>{isVerifying ? "Verifying…" : "Verify & Continue"}</AuthButton>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-zv-10">
          <TextButton
            onClick={() => {
              setIsRegistered(false);
              setOtp("");
              setStatus(null);
            }}
          >
            Change email
          </TextButton>
          <TextButton onClick={onResendOtp} disabled={isResending || cooldown > 0}>
            {isResending ? "Sending…" : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </TextButton>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Join ZenVoraa"
      title="Create Account"
      intro="Save your favourites, check out faster and follow every order."
      footer={signInLink}
    >
      {status && <AuthAlert tone={status.type}>{status.text}</AuthAlert>}
      <form onSubmit={onRegister} className="flex flex-col gap-zv-20" noValidate>
        <AuthField
          id="name"
          label="Full name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="At least 8 characters."
        />
        <AuthButton loading={isRegistering} className="mt-zv-10">
          {isRegistering ? "Creating Account…" : "Create Account"}
        </AuthButton>
        <p className="type-caption text-center text-zv-bg2">
          By creating an account you agree to our{" "}
          <Link href="/terms-conditions" className="underline underline-offset-2 hover:text-zv-primary">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-zv-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useRequestPasswordResetOtpMutation,
  useVerifyPasswordResetOtpMutation,
  useResetPasswordMutation,
} from "@/services/api/auth/auth-api";
import { AuthAlert, AuthButton, AuthField, AuthShell, OtpField, PasswordField, TextButton } from "./auth-ui";

type ResetStep = "EMAIL" | "OTP" | "RESET";
type Status = { type: "success" | "error"; text: string } | null;
const RESEND_SECONDS = 60;
const errorText = (error: unknown, fallback: string) =>
  (error as { data?: { message?: string } })?.data?.message || fallback;

const STEP_COPY: Record<ResetStep, { eyebrow: string; title: string }> = {
  EMAIL: { eyebrow: "Step 1 of 3", title: "Forgot Password" },
  OTP: { eyebrow: "Step 2 of 3", title: "Check Your Email" },
  RESET: { eyebrow: "Step 3 of 3", title: "New Password" },
};

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [cooldown, setCooldown] = useState(0);

  const [requestResetOtp, { isLoading: isRequesting }] = useRequestPasswordResetOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyPasswordResetOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!email.trim()) {
      setStatus({ type: "error", text: "Please enter your email address." });
      return;
    }
    try {
      const res = await requestResetOtp({ email: email.trim() }).unwrap();
      if (res.success) {
        setStatus({ type: "success", text: `We’ve sent a 6-digit code to ${email.trim()}.` });
        setStep("OTP");
        setCooldown(RESEND_SECONDS);
      } else {
        setStatus({ type: "error", text: res.message || "Failed to send the reset code." });
      }
    } catch (error: unknown) {
      setStatus({ type: "error", text: errorText(error, "Failed to send the reset code. Please check your connection.") });
    }
  };

  const onResendOtp = async () => {
    if (cooldown > 0) return;
    setStatus(null);
    try {
      const res = await requestResetOtp({ email: email.trim() }).unwrap();
      if (res.success) {
        setStatus({ type: "success", text: "A new code is on its way." });
        setCooldown(RESEND_SECONDS);
      }
    } catch (error: unknown) {
      setStatus({ type: "error", text: errorText(error, "Failed to send the code. Try again later.") });
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
      const res = await verifyOtp({ email: email.trim(), otp }).unwrap();
      if (res.success || res.data?.verified) {
        setStatus(null);
        setStep("RESET");
      } else {
        setStatus({ type: "error", text: res.message || "Invalid or expired code." });
      }
    } catch (error: unknown) {
      setStatus({ type: "error", text: errorText(error, "Incorrect code. Please try again.") });
    }
  };

  const onResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (newPassword.length < 8) {
      setStatus({ type: "error", text: "Your password needs at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", text: "The two passwords don’t match." });
      return;
    }
    try {
      const res = await resetPassword({ email: email.trim(), newPassword }).unwrap();
      if (res.success) {
        setStatus({ type: "success", text: "Password changed! Taking you to sign in…" });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setStatus({ type: "error", text: res.message || "Failed to reset password." });
      }
    } catch (error: unknown) {
      setStatus({ type: "error", text: errorText(error, "Failed to change password. Please request a new code.") });
    }
  };

  const copy = STEP_COPY[step];

  return (
    <AuthShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      intro={
        step === "EMAIL" ? (
          "Enter the email you signed up with and we’ll send you a code to reset your password."
        ) : step === "OTP" ? (
          <>
            Enter the code we sent to <span className="text-zv-ink">{email.trim()}</span>.
          </>
        ) : (
          "Choose a new password for your account."
        )
      }
      footer={
        <Link href="/login" className="inline-flex items-center gap-1.5 text-zv-primary underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>
      }
    >
      {status && <AuthAlert tone={status.type}>{status.text}</AuthAlert>}

      {step === "EMAIL" && (
        <form onSubmit={onRequestOtp} className="flex flex-col gap-zv-20" noValidate>
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
          <AuthButton loading={isRequesting}>{isRequesting ? "Sending…" : "Send Code"}</AuthButton>
        </form>
      )}

      {step === "OTP" && (
        <>
          <form onSubmit={onVerifyOtp} className="flex flex-col gap-zv-20" noValidate>
            <OtpField value={otp} onChange={setOtp} />
            <AuthButton loading={isVerifying}>{isVerifying ? "Verifying…" : "Verify Code"}</AuthButton>
          </form>
          <div className="flex flex-wrap items-center justify-between gap-zv-10">
            <TextButton
              onClick={() => {
                setStep("EMAIL");
                setOtp("");
                setStatus(null);
              }}
            >
              Change email
            </TextButton>
            <TextButton onClick={onResendOtp} disabled={isRequesting || cooldown > 0}>
              {isRequesting ? "Sending…" : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </TextButton>
          </div>
        </>
      )}

      {step === "RESET" && (
        <form onSubmit={onResetPassword} className="flex flex-col gap-zv-20" noValidate>
          <PasswordField
            id="new-password"
            label="New password"
            autoComplete="new-password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            hint="At least 8 characters."
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <AuthButton loading={isResetting}>{isResetting ? "Saving…" : "Save Password"}</AuthButton>
        </form>
      )}
    </AuthShell>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, RefreshCw, ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  useRequestPasswordResetOtpMutation,
  useVerifyPasswordResetOtpMutation,
  useResetPasswordMutation,
} from "@/services/api/auth/auth-api";

type ResetStep = "EMAIL" | "OTP" | "RESET";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Timer for OTP resend cooldown
  const [resendCooldown, setResendCooldown] = useState(0);

  // Mutations
  const [requestResetOtp, { isLoading: isRequesting }] = useRequestPasswordResetOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyPasswordResetOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const onRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!email) {
      setStatusMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    try {
      const res = await requestResetOtp({ email }).unwrap();
      if (res.success) {
        setStatusMessage({ type: "success", text: "Password reset OTP sent to your email!" });
        setStep("OTP");
        setResendCooldown(60); // 60 seconds cooldown
      } else {
        setStatusMessage({ type: "error", text: res.message || "Failed to send reset code" });
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Failed to request reset OTP. Please check your connection.";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  const onResendOtp = async () => {
    if (resendCooldown > 0) return;
    setStatusMessage(null);

    try {
      const res = await requestResetOtp({ email }).unwrap();
      if (res.success) {
        setStatusMessage({ type: "success", text: "A fresh reset OTP has been sent!" });
        setResendCooldown(60);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Failed to send code. Try again later.";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!otp || otp.length !== 6) {
      setStatusMessage({ type: "error", text: "Please enter a valid 6-digit code" });
      return;
    }

    try {
      const res = await verifyOtp({ email, otp }).unwrap();
      if (res.success || res.data?.verified) {
        setStatusMessage({ type: "success", text: "OTP verified! Please configure a new password." });
        setStep("RESET");
      } else {
        setStatusMessage({ type: "error", text: res.message || "Invalid or expired OTP" });
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Incorrect code. Please try again.";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  const onResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!newPassword || newPassword.length < 8) {
      setStatusMessage({ type: "error", text: "Password must be at least 8 characters long" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      const res = await resetPassword({ email, newPassword }).unwrap();
      if (res.success) {
        setStatusMessage({ type: "success", text: "Password changed successfully! Redirecting to login..." });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setStatusMessage({ type: "error", text: res.message || "Failed to reset password" });
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Failed to change password. Please request a new OTP.";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-sm">
        
        {/* LOGO INDICATOR */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-xl font-bold text-amber-500 tracking-wide">ZenVora</span>
          </Link>
        </div>

        {statusMessage && (
          <div
            className={`p-4 text-xs font-semibold mb-6 flex items-start gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            <span className="shrink-0 mt-0.5">ℹ</span>
            <p>{statusMessage.text}</p>
          </div>
        )}

        {/* STEP 1: EMAIL REQUEST */}
        {step === "EMAIL" && (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-stone-900">Forgot Password</h1>
              <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                Enter your email address and we&apos;ll send you a 6-digit code to verify your identity and reset your password.
              </p>
            </div>

            <form onSubmit={onRequestOtp} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full border border-stone-300 px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50 focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isRequesting}
                className="w-full bg-stone-900 text-white font-bold py-4 text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200 mt-2 disabled:opacity-50"
              >
                {isRequesting ? "Sending Reset Code..." : "Send Reset Code"}
              </button>

              <p className="text-center text-xs text-stone-500 mt-6 border-t border-stone-100 pt-6">
                <Link href="/login" className="font-bold text-stone-700 hover:text-amber-600 inline-flex items-center gap-1.5">
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </p>
            </form>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "OTP" && (
          <div>
            <div className="mb-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-3">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-semibold text-stone-900">Verify Reset Code</h1>
              <p className="mt-2 text-xs text-stone-500 leading-relaxed">
                We have dispatched a 6-digit reset code to <span className="font-semibold text-stone-800">{email}</span>.
                Input the code below to authorize your password change.
              </p>
            </div>

            <form onSubmit={onVerifyOtp} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 text-center">Reset Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="0 0 0 0 0 0"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-stone-300 px-4 py-3.5 tracking-[0.6em] text-center font-bold text-lg rounded-none outline-none text-stone-800 bg-stone-50 focus:border-amber-500 placeholder:tracking-normal placeholder:font-normal placeholder:text-stone-300"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-stone-900 text-white font-bold py-4 text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200 mt-2 disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </button>

              <div className="flex flex-col gap-2 items-center text-xs mt-6 border-t border-stone-100 pt-6">
                <span className="text-stone-500">Didn&apos;t receive the code?</span>
                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={resendCooldown > 0}
                  className="font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw size={12} className={resendCooldown > 0 ? "animate-spin" : ""} />
                  {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : "Resend Reset Code"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: NEW PASSWORD RESET */}
        {step === "RESET" && (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-stone-900">Configure New Password</h1>
              <p className="mt-1.5 text-xs text-stone-500">
                Please set a secure, unique password for <span className="font-semibold text-stone-855">{email}</span>.
              </p>
            </div>

            <form onSubmit={onResetPassword} className="space-y-4">
              {/* NEW PASSWORD */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    placeholder="Min 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-stone-300 px-4 py-3 pr-12 rounded-none outline-none text-sm text-stone-800 bg-stone-50 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-stone-300 px-4 py-3 pr-12 rounded-none outline-none text-sm text-stone-800 bg-stone-50 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full bg-stone-900 text-white font-bold py-4 text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200 mt-2 disabled:opacity-50"
              >
                {isResetting ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, RefreshCw, KeyRound } from "lucide-react";
import React, { useState } from "react";
import {
  useRegisterMutation,
  useVerifyEmailOtpMutation,
  useRequestEmailOtpMutation,
} from "@/services/api/auth/auth-api";

export default function SignupForm() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // OTP Flow state
  const [isRegistered, setIsRegistered] = useState(false);
  const [otp, setOtp] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Mutations
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailOtpMutation();
  const [requestOtp, { isLoading: isResending }] = useRequestEmailOtpMutation();

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!name || !email || !password) {
      setStatusMessage({ type: "error", text: "Please fill in all registration fields" });
      return;
    }

    try {
      const payload = { name, email, password };
      const res = await register(payload).unwrap();

      if (res.success) {
        setIsRegistered(true);
        setStatusMessage({ type: "success", text: "Registration successful! Verification code sent." });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Failed to create account" });
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Failed to create account. Please check your credentials.";
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
      const res = await verifyEmail({ email, otp }).unwrap();

      if (res.success) {
        setStatusMessage({ type: "success", text: "Email verified successfully! Redirecting to login..." });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setStatusMessage({ type: "error", text: res.message || "Invalid or expired code" });
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Invalid code. Please try again.";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  const onResendOtp = async () => {
    setStatusMessage(null);
    try {
      const res = await requestOtp({ email }).unwrap();
      if (res.success) {
        setStatusMessage({ type: "success", text: "A new verification code has been dispatched." });
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Failed to send code. Try again later.";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-sm">
        
        {/* LOGO INDICATOR */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/nav-logo.png"
              alt="ZenVora Logo"
              width={160}
              height={66}
              className="h-10 w-auto object-contain"
              priority
            />
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

        {!isRegistered ? (
          /* REGISTRATION SCREEN */
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-stone-900">Create Account</h1>
              <p className="mt-1.5 text-xs text-stone-500">
                Join ZenVora to explore premium handcrafted jewelry
              </p>
            </div>

            <form onSubmit={onRegister} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full border border-stone-300 px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50 focus:border-amber-500"
                />
              </div>

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

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-stone-300 px-4 py-3 pr-12 rounded-none outline-none text-sm text-stone-800 bg-stone-50 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-stone-900 text-white font-bold py-4 text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200 mt-2 disabled:opacity-50"
              >
                {isRegistering ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-xs text-stone-500 mt-6 border-t border-stone-100 pt-6">
                Already have an account?
                <Link href="/login" className="ml-1.5 font-bold text-amber-600 hover:text-amber-700">
                  Login
                </Link>
              </p>
            </form>
          </div>
        ) : (
          /* OTP VERIFICATION SCREEN */
          <div>
            <div className="mb-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-3">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-semibold text-stone-900">Verify Your Email</h1>
              <p className="mt-2 text-xs text-stone-500 leading-relaxed">
                We have dispatched a 6-digit verification code to <span className="font-semibold text-stone-800">{email}</span>.
                Please check your inbox (and spam folder) and input it below.
              </p>
            </div>

            <form onSubmit={onVerifyOtp} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 text-center">Verification Code</label>
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
                {isVerifying ? "Verifying..." : "Verify & Activate"}
              </button>

              <div className="flex flex-col gap-2 items-center text-xs mt-6 border-t border-stone-100 pt-6">
                <span className="text-stone-500">Didn&apos;t receive the code?</span>
                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={isResending}
                  className="font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw size={12} className={isResending ? "animate-spin" : ""} />
                  {isResending ? "Resending Code..." : "Resend Verification Code"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useLoginMutation } from "@/services/api/auth/auth-api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/auth.slice";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();

      if (res.success && res.data) {
        // Dispatch credentials to Redux
        dispatch(setCredentials(res.data));

        // Role-based routing
        if (res.data.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } else {
        setErrorMessage(res.message || "Failed to log in.");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message;
      const internalError = msg
      setErrorMessage(
        (internalError && "Internal Server error") ||
          "Failed to log in. Please check your credentials.",
      );
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-sm">
        
        {/* LOGO */}
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

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-stone-900">Welcome Back</h1>
          <p className="mt-1.5 text-xs text-stone-500">
            Sign in to access your dashboard and saved designs
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 text-xs font-semibold mb-6 flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-800">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <p>{errorMessage}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-4">
          
          {/* EMAIL */}
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

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-stone-300 px-4 py-3 pr-12 rounded-none outline-none text-sm text-stone-800 bg-stone-50 focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
              <input type="checkbox" className="accent-amber-500 rounded-none border-stone-300" />
              Remember me
            </label>

            <Link href="/forgot-password" className="font-semibold text-amber-600 hover:text-amber-700">
              Forgot Password?
            </Link>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-stone-900 text-white font-bold py-4 text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200 mt-4 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* SIGNUP LINK */}
          <p className="text-center text-xs text-stone-500 mt-6 border-t border-stone-100 pt-6">
            Don&apos;t have an account?
            <Link href="/signup" className="ml-1.5 font-bold text-amber-600 hover:text-amber-700">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

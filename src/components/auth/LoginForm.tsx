"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
      
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Welcome Back</h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to your Corano account
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-4">
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-gray-200 p-4 outline-none transition focus:border-[#c29958]"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-xl border border-gray-200 p-4 pr-14 outline-none transition focus:border-[#c29958]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* OPTIONS */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-[#c29958]" />
              Remember me
            </label>

            <Link href="/forgot-password" className="text-[#c29958]">
              Forgot Password?
            </Link>
          </div>

          {/* BUTTON */}
          <button className="w-full rounded-xl bg-[#c29958] py-4 font-medium text-white transition hover:bg-black">
            Login
          </button>

          {/* SIGNUP */}
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have account?
            <Link href="/signup" className="ml-2 text-[#c29958]">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

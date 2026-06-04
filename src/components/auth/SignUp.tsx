"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignupForm() {
  const [showPass, setShowPass] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your Corano account
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-4">

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-gray-200 p-4 outline-none transition focus:border-[#c29958]"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-gray-200 p-4 outline-none transition focus:border-[#c29958]"
          />

          {/* PASSWORD */}
          <div className="relative">

            <input
              type={
                showPass
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              className="w-full rounded-xl border border-gray-200 p-4 pr-14 outline-none focus:border-[#c29958]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPass(!showPass)
              }
              className="absolute right-4 top-4"
            >
              {showPass ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          {/* CONFIRM */}
          <div className="relative">

            <input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              className="w-full rounded-xl border border-gray-200 p-4 pr-14 outline-none focus:border-[#c29958]"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(
                  !showConfirm
                )
              }
              className="absolute right-4 top-4"
            >
              {showConfirm ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          {/* TERMS */}
          <label className="flex items-center gap-2 text-sm text-gray-600">

            <input
              type="checkbox"
              className="accent-[#c29958]"
            />

            Agree to Terms
          </label>

          {/* BUTTON */}
          <button
            className="w-full rounded-xl bg-[#c29958] py-4 font-medium text-white transition hover:bg-black"
          >
            Create Account
          </button>

          {/* LOGIN */}
          <p className="text-center text-sm text-gray-500">
            Already have account?

            <Link
              href="/login"
              className="ml-2 text-[#c29958]"
            >
              Login
            </Link>
          </p>

        </form>

      </div>
    </section>
  );
}
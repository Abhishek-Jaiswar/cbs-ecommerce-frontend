import type { Metadata } from "next";
import { Suspense } from "react";
import SignupForm from "@/components/auth/SignUp";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a ZenVoraa account to save favourites, check out faster and follow every order.",
};

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

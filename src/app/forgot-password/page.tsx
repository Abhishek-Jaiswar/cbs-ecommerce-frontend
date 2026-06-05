import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Recover and reset your ZenVora account password securely.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

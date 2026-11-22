import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your ZenVoraa account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

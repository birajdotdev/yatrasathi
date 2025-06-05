import { type Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new YatraSathi account",
};

export default function SignUpPage() {
  return (
    <>
      <AuthForm type="sign-up" />
    </>
  );
}

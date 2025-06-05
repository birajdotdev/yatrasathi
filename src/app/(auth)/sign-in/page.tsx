import { type Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your YatraSathi account",
};

export default function SignInPage() {
  return (
    <>
      <AuthForm />
    </>
  );
}

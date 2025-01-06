import { type Metadata } from "next";

import Signin from "@/components/auth/signin";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account",
};

export default function SigninPage() {
  return (
    <>
      <Signin />
    </>
  );
}

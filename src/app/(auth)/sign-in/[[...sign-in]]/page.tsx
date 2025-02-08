import { type Metadata } from "next";

import { ClerkLoading, SignIn } from "@clerk/nextjs";

import LoadingSpinner from "@/components/auth/loading-spinner";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Welcome back! Please sign in to continue",
};

export default function Page() {
  return (
    <>
      <ClerkLoading>
        <LoadingSpinner />
      </ClerkLoading>
      <SignIn />
    </>
  );
}

import { type Metadata } from "next";

import { ClerkLoading, SignUp } from "@clerk/nextjs";

import LoadingSpinner from "@/components/auth/loading-spinner";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Welcome! Please fill in the details to get started",
};

export default function Page() {
  return (
    <>
      <ClerkLoading>
        <LoadingSpinner />
      </ClerkLoading>
      <SignUp />
    </>
  );
}

"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { Loader2, Mail } from "lucide-react";

import { signinWithResend } from "@/actions/auth-action";
import AuthMessage from "@/components/auth/auth-message";
import SubmitButton from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";

const getOAuthErrorMessage = (error: string | null) => {
  switch (error) {
    case "OAuthAccountNotLinked":
      return "Email already used with a different provider";
    case "OAuthSignin":
      return "Unable to sign in with this provider";
    case "OAuthCallback":
      return "Authentication failed. Please try again";
    case "AccessDenied":
      return "Access denied. Please try again";
    default:
      return null;
  }
};

export function SigninForm() {
  const [state, action, isLoading] = useActionState(signinWithResend, null);
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const errorMessage = getOAuthErrorMessage(oauthError);

  return (
    <Form action={action} className="flex flex-col gap-4">
      {state?.message ? (
        <AuthMessage success={state.success} message={state.message} />
      ) : errorMessage ? (
        <AuthMessage success={false} message={errorMessage} />
      ) : null}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          className="w-full pl-10 h-10"
        />
      </div>
      <SubmitButton>
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        Continue with Email
      </SubmitButton>
    </Form>
  );
}

"use client";

import Form from "next/form";
import { useActionState } from "react";

import { Mail } from "lucide-react";

import { signinWithResend } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import AuthMessage from "./auth-message";

export function SigninForm() {
  const [state, action, isLoading] = useActionState(signinWithResend, null);

  return (
    <Form action={action} className="flex flex-col gap-4">
      {state?.message && (
        <AuthMessage success={state.success} message={state.message} />
      )}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          className="w-full pl-10 h-10"
        />
      </div>
      <Button
        className="w-full text-sm sm:text-base font-semibold"
        size="lg"
        isLoading={isLoading}
      >
        Continue with Email
      </Button>
    </Form>
  );
}

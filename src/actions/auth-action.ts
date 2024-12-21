"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/server/auth";
import { signinSchema } from "@/zod/auth-schema";

export interface PrevState {
  success: boolean;
  message: string;
}

export const signinWithResend = async (
  _prevState: PrevState | null,
  formData: FormData
): Promise<PrevState> => {
  const formValue = Object.fromEntries(formData.entries());
  const validateForm = signinSchema.safeParse(formValue);

  if (!validateForm.success) {
    return {
      success: false,
      message:
        validateForm.error.errors[0]?.message ?? "Please enter a valid email",
    };
  }

  try {
    await signIn("resend", {
      email: validateForm.data.email,
      redirect: false,
    });
    return {
      success: true,
      message: "Magic link sent! Check your inbox & spam folder.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "EmailSignInError":
          return {
            success: false,
            message: "Failed to send email. Try again.",
          };
        case "CallbackRouteError":
          return {
            success: false,
            message: "Invalid request. Please try again.",
          };
        default:
          return {
            success: false,
            message: "Authentication failed. Try again.",
          };
      }
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

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

  console.log("Email:", validateForm.data?.email);

  if (!validateForm.success) {
    return {
      success: false,
      message: validateForm.error.errors[0]?.message ?? "Invalid form data",
    };
  }

  try {
    await signIn("resend", {
      email: validateForm.data.email,
      redirect: false,
    });
    return {
      success: true,
      message: "Email sent successfully. Please check your inbox.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

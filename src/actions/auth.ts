"use server";

import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid credentials." };
        default:
          return { success: false, error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function signup(formData: FormData) {
  try {
    console.log(formData);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: "An unexpected error occurred." };
    }
    throw error;
  }
}

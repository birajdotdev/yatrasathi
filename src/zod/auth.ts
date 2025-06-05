import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";

import { users } from "@/server/db/schema";

export const signUpFormSchema = createInsertSchema(users, {
  name: (schema) =>
    schema
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Name can only contain letters and spaces",
      })
      .trim(),
  email: (schema) =>
    schema
      .min(1, "Email is required")
      .max(255, "Email must be less than 255 characters")
      .email({ message: "Please enter a valid email address" })
      .trim(),
}).pick({
  name: true,
  email: true,
});

export const signInFormSchema = signUpFormSchema.omit({ name: true });

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
export type SignInFormSchema = z.infer<typeof signInFormSchema>;
export type AuthFormSchema = SignInFormSchema | SignUpFormSchema;

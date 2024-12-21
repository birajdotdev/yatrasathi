import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email")
    .email("Please enter a valid email")
    .trim()
    .toLowerCase(),
});

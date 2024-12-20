import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

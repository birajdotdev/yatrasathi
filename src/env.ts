import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NGROK_DOMAIN: z.string().optional(),
    NGROK_AUTHTOKEN: z.string().optional(),
    UPLOADTHING_TOKEN: z.string(),
    LOCATIONIQ_API_KEY: z.string(),
    UNSPLASH_ACCESS_KEY: z.string(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    RESEND_API_KEY: z.string(),
    CRON_SECRET: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    FACEBOOK_CLIENT_ID: z.string(),
    FACEBOOK_CLIENT_SECRET: z.string(),
    POLAR_ACCESS_TOKEN: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

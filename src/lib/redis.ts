import { Redis } from "@upstash/redis";

import { env } from "@/env";

export const redis = new Redis({
  url: env.KV_URL,
  token: env.KV_REST_API_TOKEN,
});

import { checkout, polar, portal, usage } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import "server-only";

import { env } from "@/env";
import { polar as polarClient } from "@/lib/polar";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
    usePlural: true,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "1af885e9-19e4-48d8-8597-1b883330ee0b",
              slug: "free",
            },
            {
              productId: "1bf15c52-a42f-4eed-a6d0-0ba9e3d0a13a",
              slug: "pro",
            },
          ],
          successUrl: "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        // webhooks({
        //     secret: process.env.POLAR_WEBHOOK_SECRET,
        //     onCustomerStateChanged: (payload) => // Triggered when anything regarding a customer changes
        //     onOrderPaid: (payload) => // Triggered when an order was paid (purchase, subscription renewal, etc.)
        //     ...  // Over 25 granular webhook handlers
        //     onPayload: (payload) => // Catch-all for all events
        // })
      ],
    }),
  ],
});

// api/webhook/polar/route.ts
import { Webhooks } from "@polar-sh/nextjs";
import { eq } from "drizzle-orm";

import { env } from "@/env";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,
  onSubscriptionCreated: async (subscription) => {
    const customerId = subscription.data.customerId;
    const email = subscription.data.customer.email;
    const subId = subscription.data.id;

    if (customerId && subId) {
      await db
        .update(users)
        .set({
          plan: "pro",
          polarCustomerId: customerId,
          subscriptionId: subId,
        })
        .where(eq(users.polarCustomerId, customerId));
    } else if (email && subId) {
      await db
        .update(users)
        .set({
          plan: "pro",
          subscriptionId: subId,
        })
        .where(eq(users.email, email));
    }
  },
  onSubscriptionCanceled: async (subscription) => {
    const customerId = subscription.data.customerId;
    if (customerId) {
      await db
        .update(users)
        .set({
          plan: "free",
          subscriptionId: null,
        })
        .where(eq(users.polarCustomerId, customerId));
    }
  },
});

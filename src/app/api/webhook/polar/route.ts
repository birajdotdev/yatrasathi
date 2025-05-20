// api/webhook/polar/route.ts
import { Webhooks } from "@polar-sh/nextjs";
import { eq } from "drizzle-orm";

import { env } from "@/env";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,
  onSubscriptionCreated: async (subscription) => {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const customerId = subscription.data.customerId;
    const email = subscription.data.customer.email;
    const subId = subscription.data.id;

    // Check if the customer id exists in the database
    const user = await db.query.users.findFirst({
      where: eq(users.polarCustomerId, customerId),
    });

    if (!user) {
      // add customer id to the database
      await db
        .update(users)
        .set({
          polarCustomerId: customerId,
          plan: "pro",
          subscriptionId: subId,
        })
        .where(eq(users.clerkUserId, userId));
    }

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

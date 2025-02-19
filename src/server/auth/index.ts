import { cache } from "react";

import { clerkClient, auth as uncachedAuth } from "@clerk/nextjs/server";

import { type UserRole } from "@/server/db/schema";

const client = await clerkClient();

export const auth = cache(uncachedAuth);

export const getCurrentUser = cache(async () => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  return {
    clerkUserId: userId,
    dbId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    redirectToSignIn,
  };
});

export function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}

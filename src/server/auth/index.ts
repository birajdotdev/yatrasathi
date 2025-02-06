import { auth, clerkClient } from "@clerk/nextjs/server";

import { type UserRole } from "@/server/db/schema";

const client = await clerkClient();

export async function getCurrentUser() {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  return {
    clerkUserId: userId,
    dbId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    redirectToSignIn,
  };
}

export function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    privateMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}

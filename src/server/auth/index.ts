import { auth, clerkClient } from "@clerk/nextjs/server";

import { type UserRole } from "@/server/db/schema";

const client = await clerkClient();

export async function getCurrentUser() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) throw new Error("User not logged in!!");
  const { privateMetadata } = await client.users.getUser(userId);
  return {
    clerkUserId: userId,
    dbId: privateMetadata?.dbId,
    role: privateMetadata?.role,
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

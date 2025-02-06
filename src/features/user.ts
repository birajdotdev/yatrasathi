import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export const insertUser = async (data: typeof users.$inferInsert) => {
  const [newUser] = await db
    .insert(users)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: [users.clerkUserId],
      set: data,
    });

  if (!newUser) {
    throw new Error("User creation failed - no user returned from database");
  }

  return newUser;
};

export const updateUser = async (
  {
    clerkUserId,
  }: {
    clerkUserId: string;
  },
  data: Partial<typeof users.$inferInsert>
) => {
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.clerkUserId, clerkUserId))
    .returning();

  if (!updatedUser) {
    throw new Error("User update failed - no user returned from database");
  }

  return updatedUser;
};

export const deleteUser = async ({ clerkUserId }: { clerkUserId: string }) => {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .returning();

  if (!deletedUser) {
    throw new Error("User deletion failed - no user returned from database");
  }

  return deletedUser;
};

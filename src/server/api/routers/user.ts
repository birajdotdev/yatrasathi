import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { signupSchema } from "@/zod/auth-schema";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already taken",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
      });
    }),
});

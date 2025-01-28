import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";

import { env } from "@/env";
import { sendVerificationRequest } from "@/lib/auth-send-request";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      allowDangerousEmailAccountLinking: true,
    }),
    ResendProvider({
      apiKey: env.RESEND_KEY,
      from: env.MAIL_FROM_ADDRESS,
      sendVerificationRequest,
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    signIn: async ({ user, account }) => {
      if (!user.email) return false;

      switch (account?.provider) {
        case "google":
          return true;
        case "facebook":
          return true;
        default:
          if (user.name) return true;
          const name = user.email?.split("@")[0] ?? "user";
          user.name = name;
          user.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
          return true;
      }
    },
  },
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
} satisfies NextAuthConfig;

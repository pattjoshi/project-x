import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { ApiError, api } from "@/lib/api-client";
import type { UserPublic } from "@/types/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        try {
          const user = await api.post<UserPublic>("/api/auth/login", {
            email,
            password,
          });
          return {
            id: user.id,
            email: user.email,
            name: user.display_name,
            ageVerified: user.age_verified,
          };
        } catch (error) {
          if (error instanceof ApiError) return null;
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.ageVerified = (user as { ageVerified?: boolean }).ageVerified;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.ageVerified = token.ageVerified as boolean | undefined;
      return session;
    },
  },
});

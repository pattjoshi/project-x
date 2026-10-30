import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      ageVerified?: boolean;
      isAdmin?: boolean;
    };
    backendAccessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    ageVerified?: boolean;
    isAdmin?: boolean;
    backendAccessToken?: string;
  }
}

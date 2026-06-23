import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";
import { getSiteUrl, getTrustedOrigins } from "@/lib/site-url";

const appUrl = getSiteUrl();

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || `${appUrl}/api/auth`,
  trustedOrigins: getTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
  },
});

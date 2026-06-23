import { createAuthClient } from "better-auth/react";

function getAuthBaseUrl() {
  // Always use current origin so login works on localhost AND production
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${appUrl.replace(/\/$/, "")}/api/auth`;
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
});

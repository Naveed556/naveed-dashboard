import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { usernameClient } from "better-auth/client/plugins";
import { sentinelClient } from "@better-auth/infra/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: (process.env.BASE_URL as string) || "",
  plugins: [
    adminClient(),
    usernameClient(),
    sentinelClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;

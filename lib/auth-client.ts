import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { usernameClient } from "better-auth/client/plugins";
import { sentinelClient } from "@better-auth/infra/client";

export const authClient = createAuthClient({
  baseURL: (process.env.BASE_URL as string) || "",
  plugins: [adminClient(), usernameClient(),sentinelClient()],
});

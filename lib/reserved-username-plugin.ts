import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "@better-auth/core/api";
import { APIError } from "@better-auth/core/error";
import {
  normalizeUsernameForAuth,
  RESERVED_ADMIN_USERNAME,
} from "@/lib/username";

/**
 * Only accounts with role `admin` may use the reserved username `admin`.
 * Works with `/update-user` (profile updates); creation is enforced via databaseHooks + server actions.
 */
export function reservedAdminUsernamePlugin(): BetterAuthPlugin {
  return {
    id: "reserved-admin-username",
    hooks: {
      before: [
        {
          matcher(ctx: { path?: string }) {
            return ctx.path === "/update-user";
          },
          handler: createAuthMiddleware(async (ctx) => {
            const body = ctx.body as Record<string, unknown> | undefined;
            const raw = body?.username;
            if (typeof raw !== "string") return;
            if (
              normalizeUsernameForAuth(raw) !== RESERVED_ADMIN_USERNAME
            ) {
              return;
            }
            const session = ctx.context.session;
            const role = (session?.user as { role?: string } | undefined)
              ?.role;
            if (role !== "admin") {
              throw APIError.from("BAD_REQUEST", {
                code: "RESERVED_USERNAME",
                message: "This username is reserved for administrators.",
              });
            }
          }),
        },
      ],
    },
  };
}

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  type AuthRole,
  getRoleHomePath,
  getRoleLoginPath,
  hasAuthRole,
} from "@/lib/auth-roles";

type ActiveSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export type RoleSessionState =
  | {
      status: "active";
      session: ActiveSession;
    }
  | {
      status: "switch";
      sessionToken: string;
      homePath: string;
      loginPath: string;
    }
  | {
      status: "missing";
      loginPath: string;
    };

export async function getRoleSession(role: AuthRole): Promise<RoleSessionState> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (session?.user && hasAuthRole(session.user, role)) {
    return {
      status: "active",
      session,
    };
  }

  const deviceSessions = await auth.api
    .listDeviceSessions({
      headers: requestHeaders,
    })
    .catch(() => []);

  const matchingSession = deviceSessions.find(({ user }) =>
    hasAuthRole(user, role),
  );

  if (matchingSession?.session?.token) {
    return {
      status: "switch",
      sessionToken: matchingSession.session.token,
      homePath: getRoleHomePath(role),
      loginPath: getRoleLoginPath(role),
    };
  }

  return {
    status: "missing",
    loginPath: getRoleLoginPath(role),
  };
}

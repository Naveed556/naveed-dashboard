export const AUTH_ROLES = ["admin", "user"] as const;

export type AuthRole = (typeof AUTH_ROLES)[number];

export function getAuthRoles(roleValue: unknown): string[] {
  if (Array.isArray(roleValue)) {
    return roleValue.flatMap((role) => getAuthRoles(role));
  }

  if (typeof roleValue !== "string") {
    return [];
  }

  return roleValue
    .split(",")
    .map((role) => role.trim().toLowerCase())
    .filter(Boolean);
}

export function hasAuthRole(subject: unknown, role: AuthRole): boolean {
  const roleValue =
    subject && typeof subject === "object" && "role" in subject
      ? (subject as { role?: unknown }).role
      : subject;

  return getAuthRoles(roleValue).includes(role);
}

export function getRoleHomePath(role: AuthRole) {
  return role === "admin" ? "/admin" : "/dashboard";
}

export function getRoleLoginPath(role: AuthRole) {
  return role === "admin" ? "/auth/admin-login" : "/auth/user-login";
}

export function getRoleLabel(role: AuthRole) {
  return role === "admin" ? "admin" : "user";
}

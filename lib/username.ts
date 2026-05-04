/** Matches Better Auth `username` plugin normalization (see `lib/auth.ts`). */
export function normalizeUsernameForAuth(username: string): string {
  return username
    .toLowerCase()
    .replaceAll("0", "o")
    .replaceAll("3", "e")
    .replaceAll("4", "a");
}

export const RESERVED_ADMIN_USERNAME = "admin";

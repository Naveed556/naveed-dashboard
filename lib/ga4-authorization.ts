import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasAuthRole } from "@/lib/auth-roles";
import { getCachedSites } from "@/lib/cached-sites";

function getAccessibleSites(user: { accessibleSites?: unknown }) {
  return Array.isArray(user.accessibleSites)
    ? user.accessibleSites.filter((site): site is string => typeof site === "string")
    : [];
}

export async function validateGa4Access(
  requestHeaders: Headers,
  username: string,
  propertyId: string,
) {
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (hasAuthRole(session.user, "admin")) {
    return null;
  }

  if (!hasAuthRole(session.user, "user")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (session.user.username !== username) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const accessibleSites = getAccessibleSites(session.user);
  const sites = await getCachedSites();
  const canAccessProperty = sites.some(
    (site) =>
      site.propertyId === propertyId && accessibleSites.includes(site.domain),
  );

  if (!canAccessProperty) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

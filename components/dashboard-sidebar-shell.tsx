import { UserSidebar } from "@/components/user-sidebar";
import { getSitesAction } from "@/lib/server-actions";
import type { User } from "@/lib/types";

export async function DashboardSidebarShell({
  sessionUser,
}: {
  sessionUser: User;
}) {
  const allAvailableSites = await getSitesAction();
  const userAccessibleSites = sessionUser.accessibleSites || [];
  const userSites = allAvailableSites.filter((site) =>
    userAccessibleSites.includes(site.domain),
  );

  const userData = {
    name: sessionUser.name || undefined,
    email: sessionUser.email,
    image: sessionUser.image || undefined,
    accessibleSites: sessionUser.accessibleSites || [],
  };

  return <UserSidebar user={userData} sites={userSites} />;
}

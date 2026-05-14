import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ActivateRoleSession } from "@/components/activate-role-session";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toogle";
import { DashboardSidebarShell } from "@/components/dashboard-sidebar-shell";
import {
  MainInsetLoadingFallback,
  SidebarLoadingFallback,
} from "@/components/layout-loading-fallbacks";
import { getRoleSession } from "@/lib/role-session";

export default async function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const roleSession = await getRoleSession("user");

  if (roleSession.status === "missing") {
    redirect(roleSession.loginPath);
  }

  if (roleSession.status === "switch") {
    return (
      <ActivateRoleSession
        sessionToken={roleSession.sessionToken}
        homePath={roleSession.homePath}
        loginPath={roleSession.loginPath}
        label="user"
      />
    );
  }

  const session = roleSession.session;

  return (
    <SidebarProvider>
      <Suspense fallback={<SidebarLoadingFallback />}>
        <DashboardSidebarShell sessionUser={session.user} />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <h1 className="text-base font-medium">User Dashboard</h1>
          </div>
          <div className="ml-auto mr-4">
            <ModeToggle />
          </div>
        </header>
        <Suspense fallback={<MainInsetLoadingFallback />}>{children}</Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}

import * as React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavMain } from "@/components/nav-main";
import { NavSites } from "@/components/nav-sites";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GlobeIcon, LayoutDashboardIcon, UsersIcon, Zap } from "lucide-react";
import Link from "next/link";
import { getSitesAction } from "@/lib/server-actions";

export async function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sites = await getSitesAction();

  const data = {
    user: {
      name: session?.user?.name as string,
      email: session?.user?.email as string,
      avatar: session?.user?.image as string,
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: <LayoutDashboardIcon />,
        isActive: true,
      },
      {
        title: "User Management",
        url: "/admin/user-management",
        icon: <UsersIcon />,
      },
      {
        title: "Sites",
        url: "/admin/sites",
        icon: <GlobeIcon />,
      },
    ],
    sites,
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    DailyEarn | Admin
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSites sites={data.sites} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

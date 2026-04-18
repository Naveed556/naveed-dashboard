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
import { LayoutDashboardIcon, UsersIcon, Zap } from "lucide-react";
import Link from "next/link";

export async function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  function extractDomain(input: string): string | null {
    if (!input?.trim()) return null;
    try {
      const raw = input.includes("://") ? input : `https://${input}`;
      const url = new URL(raw);
      const host = url.hostname.replace(/^www\./, "");
      if (host.includes(".") && host.split(".").every(Boolean)) return host;
      return null;
    } catch {
      const cleaned = input.trim().replace(/^www\./, "");
      if (cleaned.includes(".") && cleaned.split(".").every(Boolean))
        return cleaned;
      return null;
    }
  }

  const totalSites = parseInt(process.env.TOTAL_SITES || "0", 10);
  const sites = [];
  for (let i = 1; i <= totalSites; i++) {
    const url = process.env[`SITE_${i}_URL`]!;
    const domain = extractDomain(url) as string;
    if (url) {
      sites.push({
        domain,
        url,
        favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
      });
    }
  }

  // This is sample data.
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

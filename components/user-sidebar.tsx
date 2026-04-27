"use client";

import { NavMain } from "@/components/nav-main";
import { NavSites } from "@/components/nav-sites";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BarChart3Icon,
  DollarSignIcon,
  ExternalLinkIcon,
  HomeIcon,
} from "lucide-react";

interface UserSidebarProps {
  user: {
    name?: string;
    email: string;
    image?: string | null;
    accessibleSites?: string[];
  };
  sites: {
    domain: string;
    url: string;
    favicon: string;
  }[];
}

export function UserSidebar({ user, sites }: UserSidebarProps) {
  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      title: "UTM Tracking",
      url: "/dashboard/utm-tracking-links",
      icon: <ExternalLinkIcon className="h-4 w-4" />,
    },
    {
      title: "Earnings",
      url: "/dashboard/earnings",
      icon: <DollarSignIcon className="h-4 w-4" />,
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: <BarChart3Icon className="h-4 w-4" />,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BarChart3Icon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">User Dashboard</span>
            <span className="truncate text-xs">Analytics & Earnings</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSites sites={sites} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name || "User",
            email: user.email,
            avatar: user.image || "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

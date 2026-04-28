"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname, useSearchParams } from "next/navigation";

export function NavSites({
  sites,
}: {
  sites: {
    domain: string;
    url: string;
    favicon: string;
  }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = (url: string) => {
    const currentPath =
      pathname + (searchParams ? `?site=${searchParams.get("site")}` : "");
    return currentPath === url;
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>UTM Tracking Links</SidebarGroupLabel>
      <SidebarMenu>
        {sites.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              className={`${isActive(`/dashboard/utm-tracking-links?site=${item.domain}`) ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/80 hover:text-primary-foreground" : ""} `}
            >
              <Link href={`/dashboard/utm-tracking-links?site=${item.domain}`}>
                <Avatar className="h-6 w-6 rounded-lg">
                  <AvatarImage
                    src={item.favicon}
                    alt={item.domain}
                    className="border border-muted"
                  />
                  <AvatarFallback className="rounded-lg">
                    &#127760;
                  </AvatarFallback>
                </Avatar>
                <span>{item.domain}</span>
                <ExternalLinkIcon className="ml-auto transition-transform duration-200" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

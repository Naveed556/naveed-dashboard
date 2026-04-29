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

export function NavSites({
  sites,
}: {
  sites: {
    domain: string;
    url: string;
    favicon: string;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Websites</SidebarGroupLabel>
      <SidebarMenu>
        {sites.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <Avatar className="h-6 w-6 rounded-lg">
                  <AvatarImage src={item.favicon} alt={item.domain} />
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

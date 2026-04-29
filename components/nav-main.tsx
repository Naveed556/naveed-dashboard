"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, CircleSmallIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;

  const isActive = (url: string) => currentUrl === url;

  const isItemActive = (item: {
    title: string;
    url: string;
    items?: {
      title: string;
      url: string;
    }[];
  }) => {
    if (isActive(item.url)) {
      return true;
    }

    return item.items?.some((subitem) => isActive(subitem.url)) ?? false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemActive(item);
          const hasChildren = (item.items?.length ?? 0) > 0;

          return (
            <SidebarMenuItem key={item.title}>
              {hasChildren ? (
                <Collapsible defaultOpen={true} className="group/collapsible">
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className="justify-between"
                  >
                    <CollapsibleTrigger className="flex items-center gap-2 w-full">
                      {item.icon}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subitem) => (
                        <SidebarMenuSubItem key={subitem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subitem.url)}
                            className={`${isActive(subitem.url) ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/80 hover:text-primary-foreground" : ""}`}
                          >
                            <Link href={subitem.url}>
                              {subitem.title}
                              {isActive(subitem.url) && (
                                <CircleSmallIcon className="ml-auto transition-transform duration-200" />
                              )}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`${active ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/80 hover:text-primary-foreground" : ""}`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {active && (
                      <CircleSmallIcon className="ml-auto transition-transform duration-200" />
                    )}
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

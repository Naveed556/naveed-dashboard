import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  MainInsetLoadingFallback,
  SidebarLoadingFallback,
} from "@/components/layout-loading-fallbacks";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toogle";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role === "user") {
    redirect("/dashboard");
  } else if (!session?.user) {
    redirect("/auth/login");
  }
  return (
    <SidebarProvider>
      <Suspense fallback={<SidebarLoadingFallback />}>
        <AdminSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <h1 className="text-base font-medium">Admin Panel</h1>
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

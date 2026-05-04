import { Skeleton } from "@/components/ui/skeleton";

export function SidebarLoadingFallback() {
  return (
    <div
      className="flex h-full w-[var(--sidebar-width)] flex-col gap-4 border-r bg-sidebar p-4"
      aria-hidden
    >
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-8 w-3/4 rounded-md" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

export function MainInsetLoadingFallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Skeleton className="h-48 w-full max-w-2xl rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

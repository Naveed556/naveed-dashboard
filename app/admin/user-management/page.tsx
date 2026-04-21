import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import UserTable from "./user-table";
import { WebsiteSelector } from "@/components/website-selector";

interface UserManagementProps {
  searchParams: Promise<{ website?: string }>;
}

export default async function UserManagement({
  searchParams,
}: UserManagementProps) {
  const params = await searchParams;
  const website = params.website || "";

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="my-6">
        <WebsiteSelector />
      </div>
      <Suspense fallback={<UserTableSkeleton />}>
        <UserTable website={website} />
      </Suspense>
    </div>
  );
}

function UserRowSkeleton() {
  return (
    <tr className="border-b border">
      {/* Avatar */}
      <td className="py-3 px-4">
        <Skeleton className="h-8 w-9 rounded-full" />
      </td>
      {/* Full Name */}
      <td className="py-3 px-4">
        <Skeleton className="h-4 w-32" />
      </td>
      {/* Username */}
      <td className="py-3 px-4">
        <Skeleton className="h-4 w-20" />
      </td>
      {/* Email */}
      <td className="py-3 px-4">
        <Skeleton className="h-4 w-40" />
      </td>
      {/* Commission */}
      <td className="py-3 px-4">
        <Skeleton className="h-4 w-10" />
      </td>
      {/* Status */}
      <td className="py-3 px-4">
        <Skeleton className="h-6 w-20" />
      </td>
      {/* Actions */}
      <td className="py-3 px-4">
        <Skeleton className="h-4 w-6" />
      </td>
    </tr>
  );
}

function UserTableSkeleton() {
  return (
    <div className="w-full rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/5">
        <Skeleton className="h-8 w-64 max-w-sm" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8 md:w-28" />
        </div>
      </div>

      {/* Table */}
      <table className="w-full rounded-md border">
        {/* Header */}
        <thead>
          <tr className="border-b border">
            <th className="py-3 px-4 text-left">
              <Skeleton className="h-3.5 w-12" />
            </th>
            <th className="py-3 px-4 text-left">
              <Skeleton className="h-3.5 w-20" />
            </th>
            <th className="py-3 px-4 text-left">
              <Skeleton className="h-3.5 w-20" />
            </th>
            <th className="py-3 px-4 text-left">
              <Skeleton className="h-3.5 w-12" />
            </th>
            <th className="py-3 px-4 text-left">
              <Skeleton className="h-3.5 w-20" />
            </th>
            <th className="py-3 px-4 text-left">
              <Skeleton className="h-3.5 w-14" />
            </th>
            <th className="py-3 px-4" />
          </tr>
        </thead>

        {/* Rows */}
        <tbody>
          {Array.from({ length: 10 }).map((_, i) => (
            <UserRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

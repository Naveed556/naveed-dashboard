import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import CreateUserForm from "@/components/create-user-form";
import { getUsersByRoleAndSite } from "@/lib/server-actions";

interface UserTableProps {
  website?: string;
}

export default async function UserTable({ website = "" }: UserTableProps) {
  const users = await getUsersByRoleAndSite(website);

  return (
    <DataTable
      columns={columns as ColumnDef<UserWithRole>[]}
      data={users}
      actionButton={<CreateUserForm />}
      filterValue="username"
    />
  );
}
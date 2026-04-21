import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import CreateUserForm from "@/components/create-user-form";
import { getUsersByRoleAndSite } from "@/lib/server-actions";
import type { User } from "@/lib/types";

interface UserTableProps {
  website?: string;
}

export default async function UserTable({ website = "" }: UserTableProps) {
  const users = await getUsersByRoleAndSite(website) as User[];

  return (
    <DataTable
      columns={columns as ColumnDef<User>[]}
      data={users}
      actionButton={<CreateUserForm />}
      filterValue="username"
    />
  );
}

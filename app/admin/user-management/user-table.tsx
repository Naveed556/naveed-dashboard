import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CreateUserForm from "@/components/create-user-form";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function UserTable() {
  await delay(5000);
  const { users, total } = await auth.api.listUsers({
    query: {
      limit: 100,
      offset: 0,
      sortBy: "createdAt",
      filterField: "role",
      filterValue: "user",
      filterOperator: "eq",
    },
    headers: await headers(),
  });
  return (
    <DataTable
      columns={columns as ColumnDef<UserWithRole>[]}
      data={users}
      action={<CreateUserForm />}
    />
  );
}

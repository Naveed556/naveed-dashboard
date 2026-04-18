"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function banUserAction(userId: string) {
  await auth.api.banUser({
    body: { userId },
    headers: await headers(),
  });
  revalidatePath("/admin/user-management");
}

export async function unbanUserAction(userId: string) {
  await auth.api.unbanUser({
    body: { userId },
    headers: await headers(),
  });
  revalidatePath("/admin/user-management");
}

export async function deleteUserAction(userId: string) {
  await auth.api.removeUser({
    body: { userId },
    headers: await headers(),
  });
  revalidatePath("/admin/user-management");
}

export async function revalidateUsersAction() {
  revalidatePath("/admin/user-management");
}
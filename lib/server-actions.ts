"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { allSites } from "@/lib/utils";

export async function getSitesAction() {
  return allSites();
}

export async function getUser(userId: string) {
  const user = await auth.api.getUser({
    query: {
        id: userId,
    },
    headers: await headers(),
});
  return user;
}

export async function getUsersByRoleAndSite(website: string) {
  const { users } = await auth.api.listUsers({
    query: {
      limit: 100,
      offset: 0,
      sortBy: "createdAt",
      sortDirection: "desc",
      filterField: "role",
      filterValue: "user",
      filterOperator: "eq",
    },
    headers: await headers(),
  });

  // If no website specified, return all users with role="user"
  if (!website) {
    return users;
  }

  // Filter by accessible sites - they can be on user or in user.data
  return users.filter(user => {
    // Check if accessibleSites is directly on the user object
    const accessibleSites = (user as any)?.accessibleSites || (user as any)?.data?.accessibleSites;
    return Array.isArray(accessibleSites) && accessibleSites.includes(website);
  });
}

export async function createUserAction(
  fullname: string,
  gender: string,
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  commission: number,
  sites: string[],
) {
  if (password !== confirmPassword) {
    throw new Error(
      "Passwords do not match. Please make sure both password fields are the same.",
    );
  }
  const usernameRes = await auth.api.isUsernameAvailable({
    body: {
      username,
    },
  });

  if (!usernameRes?.available) {
    throw new Error("Username already exists. Please choose a different username.");
  }

  await auth.api.createUser({
    body: {
      name: fullname
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      email,
      password,
      role: "user",
      data: {
        username: username.toLowerCase(),
        gender,
        image: `${gender === "male" ? "/male_profile.png" : "/female_profile.png"}`,
        commission,
        accessibleSites: sites,
      },
    },
    headers: await headers(),
  });
  revalidatePath("/admin/user-management");
}

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

"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { allSites } from "@/lib/utils";
import { MongoClient } from 'mongodb';
import { User } from "./types";

const mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
const db = mongoClient.db('new-dashboard');

interface DbPayment {
  userId: string;
  month: number;
  year: number;
  website: string;
  status: 'Paid' | 'Pending';
  paymentDate: string | null;
  updatedAt: Date;
}

type SerializedPayment = Omit<DbPayment, 'updatedAt'> & {
  updatedAt: string;
};

export async function getSitesAction() {
  return allSites();
}

export async function getCurrentUserSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
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

export async function updateUserAction(
  userId: string,
  data: { name?: string; email?: string; gender?: string; commission?: number; accessibleSites?: string[] },
): Promise<User> {
  if (data.email) {
    const result = await auth.api.listUsers({
      query: {
        limit: 1,
        offset: 0,
        filterField: "email",
        filterOperator: "eq",
        filterValue: data.email,
      },
      headers: await headers(),
    });

    const existingUser = result.users?.[0];
    if (existingUser && existingUser.id !== userId) {
      throw new Error("The provided email is already in use by another user.");
    }
  }

  const updatedUser = (await auth.api.adminUpdateUser({
    body: {
      userId: userId,
      data: data,
    },
    headers: await headers(),
  })) as User;

  revalidatePath(`/admin/${updatedUser?.username}?id=${userId}`);
  return updatedUser;
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

export async function getPaymentsForUser(userId: string): Promise<SerializedPayment[]> {
  await mongoClient.connect();
  const payments = await db.collection<DbPayment>('payments').find({ userId }).toArray();
  await mongoClient.close();

  return payments.map(({ _id, ...payment }) => ({
    ...payment,
    updatedAt: payment.updatedAt.toISOString(),
    paymentDate: payment.paymentDate,
  }));
}

export async function updatePaymentStatus(userId: string, month: number, year: number, website: string, status: "Paid" | "Pending", paymentDate?: string) {
  await mongoClient.connect();
  const updateData: Partial<DbPayment> = { status, updatedAt: new Date() };
  if (status === 'Paid') {
    updateData.paymentDate = paymentDate || new Date().toISOString();
  } else {
    updateData.paymentDate = null;
  }
  await db.collection<DbPayment>('payments').updateOne(
    { userId, month, year, website },
    { $set: updateData },
    { upsert: true }
  );
  await mongoClient.close();
  revalidatePath(`/admin/${userId}/payment-management`);
}

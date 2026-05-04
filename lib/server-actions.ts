"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCachedSites } from "@/lib/cached-sites";
import { User } from "./types";
import clientPromise from "./mongodb";
import { isAllowedGender } from "@/lib/gender";
import {
  normalizeUsernameForAuth,
  RESERVED_ADMIN_USERNAME,
} from "@/lib/username";

const client = await clientPromise;
const db = client.db();

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

export async function extractDomain(input: string): Promise<string | null> {
  if (!input?.trim()) return null;
  try {
    const raw = input.includes("://") ? input : `https://${input}`;
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host.includes(".") && host.split(".").every(Boolean)) return host;
    return null;
  } catch {
    const cleaned = input.trim().replace(/^www\./, "");
    if (cleaned.includes(".") && cleaned.split(".").every(Boolean))
      return cleaned;
    return null;
  }
}

export async function addSiteAction(url: string, propertyId: string) {
  const domain = await extractDomain(url);
  if (!domain) throw new Error("Invalid URL");

  await db.collection('sites').insertOne({
    domain,
    url,
    propertyId,
    favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain as string)}&sz=64`,
    createdAt: new Date(),
  });
  revalidatePath('/admin');
  revalidateTag("sites", "max");
}

export async function deleteSiteAction(domain: string) {
  await db.collection('sites').deleteOne({ domain });
  revalidatePath('/admin');
  revalidateTag("sites", "max");
}

export async function getSitesAction() {
  return getCachedSites();
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
    const accessibleSites = (user as User)?.accessibleSites || [];
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
  if (!isAllowedGender(gender)) {
    throw new Error("Gender must be male or female.");
  }
  if (normalizeUsernameForAuth(username.trim()) === RESERVED_ADMIN_USERNAME) {
    throw new Error("This username is reserved for administrators.");
  }
  const usernameRes = await auth.api.isUsernameAvailable({
    body: {
      username,
    },
  });

  if (!usernameRes?.available) {
    throw new Error("Username already exists. Please choose a different username.");
  }

  const emailResponse = await auth.api.sendVerificationEmail({
    body: {
      email,
      callbackURL: "/auth/login",
    },
    headers: {
      "x-better-auth-internal-request": "true",
    },
  });

  if (!emailResponse?.status) {
    throw new Error("Failed to send verification email. Please check the email address and try again.");
  }

  const newUser = await auth.api.createUser({
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
  if (!newUser) {
    throw new Error("Failed to create user. Please try again.");
  }
  revalidatePath("/admin/user-management");
}

export async function updateUserAction(
  userId: string,
  data: { name?: string; email?: string; gender?: string; commission?: number; accessibleSites?: string[] },
): Promise<User> {
  if (data.gender !== undefined && !isAllowedGender(data.gender)) {
    throw new Error("Gender must be male or female.");
  }
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
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return updatedUser;
}

export async function updateCurrentUserProfile(data: {
  name: string;
  username: string;
  gender: string;
}): Promise<void> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("You must be signed in to update your profile.");
  }

  const current = session.user as User;
  if (!isAllowedGender(data.gender)) {
    throw new Error("Gender must be male or female.");
  }
  const normalizedUsername = normalizeUsernameForAuth(data.username.trim());
  const currentUsername = normalizeUsernameForAuth(current.username ?? "");

  if (
    normalizedUsername === RESERVED_ADMIN_USERNAME &&
    current.role !== "admin"
  ) {
    throw new Error("This username is reserved for administrators.");
  }

  if (normalizedUsername !== currentUsername) {
    const usernameRes = await auth.api.isUsernameAvailable({
      body: {
        username: normalizedUsername,
      },
    });
    if (!usernameRes?.available) {
      throw new Error("That username is already taken. Please choose another.");
    }
  }

  const body: {
    name: string;
    username: string;
    gender: string;
    image?: string;
  } = {
    name: data.name.trim(),
    username: normalizedUsername,
    gender: data.gender,
  };

  if (data.gender === "male" || data.gender === "female") {
    body.image =
      data.gender === "male" ? "/male_profile.png" : "/female_profile.png";
  }

  await auth.api.updateUser({
    body,
    headers: await headers(),
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
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
  const payments = await db.collection<DbPayment>('payments').find({ userId }).toArray();

  return payments.map(({ _id, ...payment }) => ({
    ...payment,
    updatedAt: payment.updatedAt.toISOString(),
    paymentDate: payment.paymentDate,
  }));
}

export async function updatePaymentStatus(userId: string, month: number, year: number, website: string, status: "Paid" | "Pending", paymentDate?: string) {
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
  revalidatePath(`/admin/${userId}/payment-management`);
}

export async function forgotPasswordAction(email: string) {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new Error("Please provide a valid email address.");
  }
  const emailResponse = await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: "/auth/reset-password",
    },
  });

  if (!emailResponse?.status) {
    throw new Error("Failed to send password reset email. Please check the email address and try again.");
  }
}

export async function resetpasswordAction(token: string, newPassword: string, confirmPassword: string) {
  if (!token) {
    throw new Error("Invalid Token! Please try again.")
  }

  if (newPassword != confirmPassword) {
    throw new Error("Passwords do not match. Please make sure both password fields are the same.")
  }
  const data = await auth.api.resetPassword({
    body: {
      newPassword,
      token,
    },
  });
  if (!data?.status) {
    throw new Error("Unable to Reset Password please try again.")
  }
}

export async function updatePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
  if (newPassword != confirmPassword) {
    throw new Error("Passwords do not match. Please make sure both password fields are the same.");
  }

  const data = await auth.api.changePassword({
    body: {
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    },
    headers: await headers(),
  });

  if (!data?.user) {
    throw new Error("Unable to change password.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
}
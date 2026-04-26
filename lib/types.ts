import type { auth } from "@/lib/auth";

// Better Auth types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

export interface Sites {
    domain: string;
    url: string;
    favicon: string;
    propertyId: string;
}

export interface Payment {
    month: string;
    monthNumber: number;
    year: number;
    website: string;
    userEarnings: number;
    adminProfit: number;
    status: "Pending" | "Paid";
    paymentDate: string | null;
}
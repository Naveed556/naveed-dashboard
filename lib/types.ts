export interface Sites {
    domain: string;
    url: string;
    favicon: string;
    propertyId: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    image: string;
    commission: number;
    accessibleSites: string[];
    role: "admin" | "user";
    isbanned: boolean;
}

export interface Payment {
    month: string;
    year: number;
    website: string;
    userEarnings: number;
    adminProfit: number;
    status: "Pending" | "Paid";
    paymentDate: string | null;
}
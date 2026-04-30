import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PlatformExpense = 0.40; // 40% platform fee
export const Client_Email = process.env.NEXT_PUBLIC_CLIENT_EMAIL || "";
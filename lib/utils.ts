import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Sites } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractDomain(input: string): string | null {
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

export const totalSites = parseInt(process.env.TOTAL_SITES || "0", 10);
export const allSites = () => {
  let sites: Sites[] = [];
  for (let i = 1; i <= totalSites; i++) {
    const url = process.env[`SITE_${i}_URL`]!;
    const domain = extractDomain(url) as string;
    const propertyId = process.env[`SITE_${i}_PROPERTY`]!
    if (url) {
      sites.push({
        domain,
        url,
        favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
        propertyId
      });
    }
  }
  return sites;
};
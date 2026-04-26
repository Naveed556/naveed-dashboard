"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSitesAction } from "@/lib/server-actions";

export function WebsiteSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sites, setSites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedSite = searchParams.get("website") || "all";

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const allSitesData = await getSitesAction();
        const siteDomains: string[] = allSitesData.map((site) => site.domain);
        setSites(siteDomains);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch sites:", error);
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams();
    // Only set website param if not "all"
    if (value && value !== "all") {
      params.set("website", value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="website-select" className="text-sm font-medium">
        Filter by Website:
      </label>
      <Select
        value={selectedSite}
        onValueChange={handleSelect}
        disabled={loading}
      >
        <SelectTrigger id="website-select" className="w-64">
          <SelectValue placeholder="Select a website..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Websites</SelectItem>
          {sites.map((site) => (
            <SelectItem key={site} value={site}>
              {site}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

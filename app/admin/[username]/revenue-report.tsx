"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { getSitesAction } from "@/lib/server-actions";
import {
  SiteRevenueChart,
  type RevenueData,
} from "@/components/site-revenue-chart";
import type { Sites } from "@/lib/types";
import { toast } from "sonner";

interface SiteReport {
  site: Sites;
  data: RevenueData[];
  error?: string;
}

export default function RevenueReport({
  username,
  accessibleSites,
}: {
  username: string;
  accessibleSites: string[];
}) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [timeRange, setTimeRange] = useState("30d");
  const [siteReports, setSiteReports] = useState<SiteReport[]>([]);
  const [siteConfigs, setSiteConfigs] = useState<Sites[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSites = async () => {
      try {
        const allSites = (await getSitesAction()) as Sites[];
        const filteredSites = (allSites ?? []).filter((site) =>
          accessibleSites.includes(site.domain),
        );
        setSiteConfigs(filteredSites);
      } catch (error) {
        toast.error(`Error loading site configurations: ${error}`);
        console.error("Failed to load site configurations:", error);
        setSiteConfigs([]);
      }
    };

    loadSites();
  }, [accessibleSites]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!dateRange.from || !dateRange.to || siteConfigs.length === 0) {
        setSiteReports([]);
        return;
      }

      setLoading(true);
      const startDate = format(dateRange.from, "yyyy-MM-dd");
      const endDate = format(dateRange.to, "yyyy-MM-dd");

      try {
        const reports = await Promise.all(
          siteConfigs.map(async (site) => {
            try {
              const response = await fetch("/api/ga4/earnings-report", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username,
                  propertyId: site.propertyId,
                  startDate,
                  endDate,
                }),
              });

              if (!response.ok) {
                const payload = await response.json();
                throw new Error(payload?.error || "Failed to fetch report");
              }

              const data = (await response.json()) as RevenueData[];
              return { site, data };
            } catch (error) {
              toast.error(`Error loading report for ${site.domain}: ${error}`);
              console.error(`Failed to load report for ${site.domain}:`, error);
              return {
                site,
                data: [],
                error:
                  error instanceof Error
                    ? error.message
                    : "Unable to fetch revenue data.",
              };
            }
          }),
        );

        setSiteReports(reports);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [dateRange, siteConfigs, username]);

  const handlePresetChange = (value: string) => {
    setTimeRange(value);
    const now = new Date();
    let days = 30;
    if (value === "7d") days = 7;
    if (value === "90d") days = 90;

    setDateRange({
      from: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
      to: now,
    });
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>User Earnings</CardTitle>
          <CardDescription>
            View earnings over time for each site you have access to.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-60 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                autoFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range && range.from && range.to) {
                    setDateRange({ from: range.from, to: range.to });
                    setTimeRange("custom");
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-2 pt-4 sm:px-6 sm:pt-6">
        {siteConfigs.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No site configuration found.
          </div>
        ) : (
          <div className="grid gap-4">
            {siteReports.map(({ site, data, error }) => (
              <SiteRevenueChart
                key={site.domain}
                siteName={site.domain}
                data={data}
                loading={loading}
                description={
                  error ??
                  `Revenue data for ${site.domain} from ${format(dateRange.from!, "LLL dd, y")} to ${format(dateRange.to!, "LLL dd, y")}.`
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

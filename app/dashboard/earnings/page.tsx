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
import { getSitesAction, getCurrentUserSession } from "@/lib/server-actions";
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

export default function EarningsPage() {
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
  const [username, setUsername] = useState<string>("");
  const [commission, setCommission] = useState<number>(0);
  const [accessibleSites, setAccessibleSites] = useState<string[]>([]);

  // Get current user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getCurrentUserSession();
        if (session?.user) {
          setUsername((session.user as any).username || "");
          setCommission((session.user as any).commission || 0);
          const sites =
            (session.user as any).accessibleSites ||
            (session.user as any).data?.accessibleSites ||
            [];
          setAccessibleSites(sites);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        toast.error("Failed to load user data");
      }
    };

    fetchSession();
  }, []);

  // Load site configurations based on user's accessible sites
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

    if (accessibleSites.length > 0) {
      loadSites();
    }
  }, [accessibleSites]);

  // Fetch earning reports
  useEffect(() => {
    const fetchReports = async () => {
      if (
        !dateRange.from ||
        !dateRange.to ||
        siteConfigs.length === 0 ||
        !username
      ) {
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
              const subtractCommission = (value: number) => {
                return value - (value * commission) / 100;
              };

              const data = (await response.json()) as RevenueData[];
              data.forEach((d) => {
                d.impressions = subtractCommission(d.impressions);
                d.totalRevenue = subtractCommission(d.totalRevenue);
                d.rpm = subtractCommission(d.rpm);
              });
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
                    : "Unable to fetch earnings data.",
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
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>My Earnings</CardTitle>
            <CardDescription>
              View your earnings over time for each site you have access to.
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
              {accessibleSites.length === 0
                ? "No sites assigned to your account yet."
                : "Loading site configurations..."}
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
                    `Your earnings for ${site.domain} from ${format(dateRange.from!, "LLL dd, y")} to ${format(dateRange.to!, "LLL dd, y")}.`
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

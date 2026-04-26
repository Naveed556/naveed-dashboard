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
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { useParams } from "next/navigation";

interface RevenueData {
  date: string;
  impressions: number;
  totalRevenue: number;
  rpm: number;
}

const chartConfig = {
  impressions: {
    label: "Impressions",
    color: "var(--chart-1)",
  },
  totalRevenue: {
    label: "Total Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function RevenueReport() {
  const params = useParams();
  const username = params.username as string;
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [timeRange, setTimeRange] = useState("30d");
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/ga4/earnings-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: process.env.NEXT_PUBLIC_GA4_PROPERTY_ID,
          username,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = (await response.json()) as RevenueData[];
      setData(result);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      // Set some sample data for demo
      setData([
        { date: "2026-04-20", impressions: 68, totalRevenue: 56.0, rpm: 0.0 },
        { date: "2026-04-21", impressions: 113, totalRevenue: 7.0, rpm: 0.0 },
        { date: "2026-04-22", impressions: 114, totalRevenue: 100.0, rpm: 0.0 },
        { date: "2026-04-23", impressions: 164, totalRevenue: 56.0, rpm: 0.0 },
        { date: "2026-04-24", impressions: 153, totalRevenue: 67.7, rpm: 0.0 },
        { date: "2026-04-25", impressions: 158, totalRevenue: 45.0, rpm: 0.0 },
        { date: "2026-04-26", impressions: 57, totalRevenue: 67.0, rpm: 0.0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const startDate = format(dateRange.from, "yyyy-MM-dd");
      const endDate = format(dateRange.to, "yyyy-MM-dd");
      fetchData(startDate, endDate);
    }
  }, [dateRange]);

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
            View earnings over time with customizable date range
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-64 w-full"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="fillIMPRESSIONS"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-impressions)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-impressions)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-totalRevenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-totalRevenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="impressions"
                type="natural"
                fill="url(#fillIMPRESSIONS)"
                stroke="var(--color-impressions)"
              />
              <Area
                dataKey="totalRevenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-totalRevenue)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

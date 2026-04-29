"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface RevenueData {
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

interface SiteRevenueChartProps {
  siteName: string;
  data: RevenueData[];
  loading?: boolean;
  description?: string;
}

export function SiteRevenueChart({
  siteName,
  data,
  loading = false,
  description,
}: SiteRevenueChartProps) {
  const hasData = data.length > 0;
  const totals = data.reduce(
    (acc, curr) => {
      acc.impressions += curr.impressions;
      acc.totalRevenue += curr.totalRevenue;
      return acc;
    },
    { impressions: 0, totalRevenue: 0 },
  );

  return (
    <Card className="min-h-90">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-base">{siteName}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="border rounded-md p-3 hover:bg-muted transition-colors">
              <p className="text-sm text-muted-foreground">Total Impressions</p>
              <p className="text-lg font-medium">
                {totals.impressions.toLocaleString()}
              </p>
            </div>
            <div className="border rounded-md p-3 hover:bg-muted transition-colors">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-medium">
                ${totals.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-72 text-muted-foreground">
            Loading chart…
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-72 text-muted-foreground">
            No revenue data available for this site in the selected range.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-80 w-full"
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
                    labelFormatter={(value) =>
                      new Date(String(value)).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
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

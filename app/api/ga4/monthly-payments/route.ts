import { PlatformExpense } from "@/lib/constants";
import { validateGa4Access } from "@/lib/ga4-authorization";
import { google } from "googleapis";
import { NextResponse, NextRequest } from "next/server";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL!,
    private_key: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
});

const subtractPlatformExpense = (value: number) => {
  return value - value * PlatformExpense;
};

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const username =
      typeof payload.username === "string" ? payload.username.trim() : "";
    const propertyId =
      typeof payload.propertyId === "string" ? payload.propertyId.trim() : "";

    if (!username) {
      return NextResponse.json(
        { error: "username is missing or empty." },
        { status: 400 },
      );
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId is missing or empty." },
        { status: 400 },
      );
    }

    const accessError = await validateGa4Access(
      request.headers,
      username,
      propertyId,
    );
    if (accessError) {
      return accessError;
    }

    const analyticsData = google.analyticsdata({ version: "v1beta", auth });

    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dimensions: [
          { name: "sessionCampaignName" },
          { name: "month" },
          { name: "year" },
        ],
        metrics: [{ name: "totalRevenue" }],
        dateRanges: [{ startDate: "2025-01-01", endDate: "today" }],
        dimensionFilter: {
          filter: {
            fieldName: "sessionCampaignName",
            stringFilter: {
              matchType: "ENDS_WITH",
              value: `_${username}`,
            },
          },
        },
        orderBys: [
          {
            dimension: { orderType: "NUMERIC", dimensionName: "month" },
          },
        ],
        keepEmptyRows: true,
      },
    });

    const rows = response.data.rows;

    if (!rows || rows.length === 0) {
      console.warn(
        `No data returned from GA4 API. Filter: campaigns ending with "_${username}"`,
      );
      return NextResponse.json([]);
    }

    function getMonthName(month: number) {
      const date = new Date();
      date.setMonth(month - 1);
      return date.toLocaleString("default", { month: "long" });
    }

    const monthRevenueMap = new Map<string, number>();

    rows.forEach((row) => {
      const monthStr = row.dimensionValues?.[1]?.value;
      if (!monthStr) return;
      const month = parseInt(monthStr);
      const year = parseInt(row.dimensionValues?.[2]?.value || "0");
      const revenue = parseFloat(row.metricValues?.[0]?.value || "0");
      const key = `${year}-${month}`;
      monthRevenueMap.set(key, (monthRevenueMap.get(key) || 0) + revenue);
    });

    const formattedData = Array.from(monthRevenueMap.entries()).map(
      ([key, totalRevenue]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          month: getMonthName(month),
          monthNumber: month,
          year,
          revenue: Number(subtractPlatformExpense(totalRevenue).toFixed(2)),
        };
      },
    );

    formattedData.sort(
      (a, b) => a.year - b.year || a.monthNumber - b.monthNumber,
    );

    return NextResponse.json(formattedData);
  } catch (error: unknown) {
    const err = error as { message?: string; code?: number; status?: string };
    console.error("Error fetching campaign data:", {
      message: err.message,
      code: err.code,
      status: err.status,
    });
    return NextResponse.json(
      { error: err.message || "An error occurred while fetching data." },
      { status: err.code || 500 },
    );
  }
}

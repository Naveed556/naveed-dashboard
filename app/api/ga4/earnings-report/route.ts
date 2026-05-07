import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { PlatformExpense } from "@/lib/constants";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
});

const subtractPlatformExpense = (value: number) => {
  return value - value * PlatformExpense;
};

export async function POST(request: NextRequest) {
  try {
    const { username, propertyId, startDate, endDate } = await request.json();

    if (!propertyId || propertyId.trim() === "") {
      return NextResponse.json(
        { error: "propertyId is missing or empty." },
        { status: 400 },
      );
    }
    if (!username || username.trim() === "") {
      return NextResponse.json(
        { error: "username parameter is missing or empty." },
        { status: 400 },
      );
    }
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: "Start date should be less than end date" },
        { status: 400 },
      );
    }

    const analyticsData = google.analyticsdata({ version: "v1beta", auth });

    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dimensions: [{ name: "date" }, { name: "sessionCampaignName" }],
        metrics: [{ name: "activeUsers" }, { name: "totalRevenue" }],
        dateRanges: [{ startDate, endDate }],
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
          { dimension: { orderType: "NUMERIC", dimensionName: "date" } },
        ],
      },
    });

    const rows = response.data.rows;

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        message: "No data found for the given username parameter.",
      });
    }

    // Aggregate by date
    const dateMap = new Map();

    rows.forEach((row) => {
      const date = row.dimensionValues![0].value!;
      const activeUsers = parseInt(row.metricValues![0].value!, 10);
      const revenue = parseFloat(row.metricValues![1].value!);

      if (!dateMap.has(date)) {
        dateMap.set(date, { totalUsers: 0, totalRevenue: 0 });
      }

      const dateData = dateMap.get(date);
      dateData.totalUsers += activeUsers;
      dateData.totalRevenue += revenue;
    });

    function formatDate(dateStr: string) {
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);
      return `${year}-${month}-${day}`;
    }

    const data = Array.from(dateMap, ([date, { totalUsers, totalRevenue }]) => {
      const totalUsersAfterFee = Math.floor(
        subtractPlatformExpense(totalUsers),
      );
      const totalRevenueAfterFee = subtractPlatformExpense(totalRevenue);
      const avgRpm =
        totalUsers > 0 ? (totalRevenueAfterFee / totalUsersAfterFee) * 1000 : 0;
      return {
        date: formatDate(date),
        impressions: totalUsersAfterFee,
        totalRevenue: Number(totalRevenueAfterFee.toFixed(2)),
        rpm: Number(avgRpm.toFixed(2)),
      };
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as { message?: string; code?: number; status?: string };
    console.error("Full error:", {
      message: err.message,
      code: err.code,
      status: err.status,
    });
    return NextResponse.json(
      { error: err.message || "No Data Found" },
      { status: 500 },
    );
  }
}

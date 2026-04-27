// https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema
import { PlatformExpense } from "@/lib/constants";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextRequest, NextResponse } from "next/server";


// Initialize the client
const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY!.replace(/\\n/g, '\n'), // Correctly format the private key
    },
});

export async function POST(request: NextRequest) {
    try {
        const { username, propertyId, startDate, endDate } = await request.json();

        if (!propertyId || propertyId.trim() === "") {
            return NextResponse.json({ error: "propertyId is missing or empty." }, { status: 400 });
        }

        if (!username || username.trim() === "") {
            return NextResponse.json({ error: "username parameter is missing or empty." });
        }

        if (new Date(startDate) > new Date(endDate)) {
            return NextResponse.json({ error: "Start date should be less than end date" }, { status: 400 });
        }

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dimensions: [{ name: "date" }, { name: "sessionCampaignName" }],
            metrics: [{ name: "activeUsers" }, { name: "totalRevenue" }],
            dateRanges: [{ startDate: startDate, endDate: endDate }],
            dimensionFilter: {
                filter: {
                    fieldName: "sessionCampaignName",
                    stringFilter: {
                        matchType: "ENDS_WITH",
                        value: `_${username}` // Pass username source dynamically
                    }
                }
            },
            orderBys: [{ dimension: { orderType: "NUMERIC", dimensionName: "date" } }]
        });

        // If no data is returned, handle that case
        if (!response.rows || response.rows.length === 0) {
            return NextResponse.json({ message: "No data found for the given username parameter." });
        }

        // Aggregate data by date
        const dateMap = new Map();

        response.rows.forEach(row => {
            const date = row.dimensionValues![0].value; // Date for this entry
            const activeUsers = parseInt(row.metricValues![0].value as string, 10); // Users for this date
            const revenue = parseFloat(row.metricValues![1].value as string); // Revenue for this date

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

        // Map the aggregated data to the required format
        const data = Array.from(dateMap, ([date, { totalUsers, totalRevenue }]) => {
            const totalUsersAfterFee = Math.floor(totalUsers - (totalUsers * PlatformExpense));
            const totalRevenueAfterFee = totalRevenue - (totalRevenue * PlatformExpense);
            const avgRpm = totalUsers > 0 ? (totalRevenueAfterFee / totalUsersAfterFee) * 1000 : 0;
            return {
                date: formatDate(date),
                impressions: totalUsersAfterFee,
                totalRevenue: Number(totalRevenueAfterFee.toFixed(2)),
                rpm: Number(avgRpm.toFixed(2)),
            };
        });

        // Return the response using NextResponse
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching username Campaign Data:', error);
        return NextResponse.json({ error: 'No Data Found' }, { status: 500 });
    }
}
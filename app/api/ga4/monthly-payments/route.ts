import { PlatformExpense } from "@/lib/constants";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse, NextRequest } from "next/server";

const client_email = process.env.NEXT_PUBLIC_CLIENT_EMAIL!;
const private_key = process.env.PRIVATE_KEY!.replace(/\\n/g, '\n'); // Correctly format the private key
// Initialize the Google Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email,
        private_key
    },
});

const subtractPlatformExpense = (value: number) => {
    return value - (value * PlatformExpense);
}

export async function POST(request: NextRequest) {
    try {
        // Parse the request body to get the username
        const { username, propertyId } = await request.json();

        if (!username || username.trim() === "") {
            return NextResponse.json({ error: "username is missing or empty." }, { status: 400 });
        }

        if (!propertyId || propertyId.trim() === "") {
            return NextResponse.json({ error: "propertyId is missing or empty." }, { status: 400 });
        }

        // Run the Google Analytics report
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dimensions: [
                { name: "sessionCampaignName" },
                { name: "month" },
                { name: "year" },
            ],
            metrics: [
                { name: "totalRevenue" },
            ],
            dateRanges: [
                { startDate: "2025-01-01", endDate: "today" },
            ],
            dimensionFilter: {
                filter: {
                    fieldName: "sessionCampaignName",
                    stringFilter: {
                        matchType: "ENDS_WITH",
                        value: `_${username}`
                    }
                }
            },
            orderBys: [
                {
                    dimension: { orderType: "NUMERIC", dimensionName: "month" }
                }
            ],
            keepEmptyRows: true
        });

        if (!response.rows || response.rows.length === 0) {
            console.warn(`No data returned from GA4 API. Filter: campaigns ending with "_${username}"`);
            return NextResponse.json([]);
        }

        function getMonthName(month: number) {
            const date = new Date();
            date.setMonth(month - 1);  // JavaScript months are zero-based
            return date.toLocaleString('default', { month: 'long' });
        }

        // Aggregate revenue by year and month
        const monthRevenueMap = new Map<string, number>();

        response.rows.forEach(row => {
            const monthStr = row.dimensionValues?.[1]?.value;
            if (!monthStr) return;
            const month = parseInt(monthStr);
            const year = parseInt(row.dimensionValues?.[2]?.value || '0');
            const revenue = parseFloat(row.metricValues?.[0]?.value || '0');
            const key = `${year}-${month}`;
            monthRevenueMap.set(key, (monthRevenueMap.get(key) || 0) + revenue);
        });

        // Format the response
        const formattedData = Array.from(monthRevenueMap.entries()).map(([key, totalRevenue]) => {
            const [year, month] = key.split('-').map(Number);
            return {
                month: getMonthName(month),
                monthNumber: month,
                year,
                revenue: Number(subtractPlatformExpense(totalRevenue)).toFixed(2),
            };
        });

        // Sort by year and month
        formattedData.sort((a, b) => a.year - b.year || a.monthNumber - b.monthNumber);

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        return NextResponse.json({ error: "An error occurred while fetching data." }, { status: 500 });
    }
}

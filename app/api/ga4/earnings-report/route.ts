import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { username } from "better-auth/plugins";
import { NextRequest, NextResponse } from "next/server";

// Initialize the Google Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email: process.env.CLIENT_EMAIL!,
        private_key: process.env.PRIVATE_KEY!.replace(/\\n/g, '\n'), // Correctly format the private key
    },
});

export async function POST(request: NextRequest) {
    try {
        const { propertyId, username, startDate, endDate } = await request.json();

        // Validate input
        if (!propertyId || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required fields: propertyId, startDate, endDate" }, { status: 400 });
        }

        // Fetch earnings report from Google Analytics Data API
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            metrics: [{ name: "activeUsers" }, { name: "totalRevenue" }],
            dimensions: [{ name: "date" }, { name: "sessionUserCampaignName" }],
            dimensionFilter: {
                filter: {
                    fieldName: "sessionUserCampaignName",
                    stringFilter: {
                        matchType: "ENDS_WITH",
                        value: `_${username}`,
                    },
                },
            },
            orderBys: [
                { dimension: { dimensionName: "date", orderType: "NUMERIC" }, desc: false },
            ],
        });

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch earnings report", details: error }, { status: 500 });
    }
}
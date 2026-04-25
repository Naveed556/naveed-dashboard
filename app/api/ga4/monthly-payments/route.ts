import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse, NextRequest } from "next/server";

const client_email = process.env.CLIENT_EMAIL!;
const private_key = process.env.PRIVATE_KEY!.replace(/\\n/g, '\n'); // Correctly format the private key
// Initialize the Google Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email,
        private_key
    },
});

export async function POST(request: NextRequest) {
    try {
        // Parse the request body to get the username
        const username = "adeell";
        const propertyId = '520376914';

        if (!username || username.trim() === "") {
            return NextResponse.json({ error: "username is missing or empty." });
        }

        // Run the Google Analytics report
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dimensions: [
                { name: "sessionCampaignName" },
                { name: "month" },  // Group results by month
            ],
            metrics: [
                { name: "totalRevenue" },  // Get the total revenue metric
            ],
            dateRanges: [
                { startDate: "2025-01-01", endDate: "today" },  // Get data from the earliest possible date until now
            ],
            dimensionFilter: {
                filter: {
                    fieldName: "sessionCampaignName",
                    stringFilter: {
                        matchType: "ENDS_WITH",
                        value: `_${username}` // Filter campaigns containing the username dynamically
                    }
                }
            },
            orderBys: [
                {
                    dimension: { orderType: "NUMERIC", dimensionName: "month" }
                }
            ],
            keepEmptyRows: true  // Include rows even if metrics are 0
        });

        // Log raw API response for debugging
        // console.log('Raw API response rows:', response.rows?.length || 0);
        // console.log('Full response:', JSON.stringify(response, null, 2));

        if (!response.rows || response.rows.length === 0) {
            console.warn(`No data returned from GA4 API. Filter: campaigns ending with "_${username}"`);
            return NextResponse.json([]);
        }

        // Helper function to generate date ranges for each month
        function getDateRange(month: number) {
            const year = new Date().getFullYear();  // Get current year
            const firstDate = `01-${month}-${year}`;
            const lastDate = new Date(year, month, 0).getDate(); // Last day of the month
            return `${firstDate} to ${lastDate}-${month}-${year}`;
        }

        // Helper function to convert month number to month name
        function getMonthName(month: number) {
            const date = new Date();
            date.setMonth(month - 1);  // JavaScript months are zero-based
            return date.toLocaleString('default', { month: 'long' });
        }

        // Format the response
        const monthRevenueMap = new Map();  // To store the aggregated revenue for each month

        // Iterate through all rows and aggregate the revenue by month (including zero revenue)
        response.rows.forEach(row => {
            const month = row.dimensionValues![1].value;  // Get the month
            const revenue = parseFloat(row.metricValues![0].value as string);  // Get the revenue for this campaign

            // Sum the revenue for this month
            if (monthRevenueMap.has(month)) {
                monthRevenueMap.set(month, monthRevenueMap.get(month) + revenue);  // Add to existing revenue
            } else {
                monthRevenueMap.set(month, revenue);  // Initialize the month with its first revenue
            }
        });

        // Convert the Map to an array and format the response
        const formattedData = Array.from(monthRevenueMap.entries()).map(([month, totalRevenue]) => {
            const dateRange = getDateRange(month);  // Create date ranges for each month
            return {
                dateRange: dateRange,
                month: getMonthName(month),  // Convert month number to name
                revenue: Number(totalRevenue.toFixed(2)) // Format the total revenue to 2 decimal places
            };
        });



        return NextResponse.json(formattedData);
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        return NextResponse.json({ error: "An error occurred while fetching data." }, { status: 500 });
    }
}

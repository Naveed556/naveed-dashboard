"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { paymentColumns } from "./payment-columns";
import { Payment } from "@/lib/types";
import { Globe } from "lucide-react";

interface PaymentManagementProps {
  userId: string;
  username: string;
  accessibleSites?: string[];
}

export function PaymentManagement({
  userId,
  username,
  accessibleSites = [],
}: PaymentManagementProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Demo payments — replace with a real fetch keyed by userId.
  // Each payment's `website` field must match one of the accessibleSites values.
  const demoPayments: Payment[] = [
    {
      month: "January",
      year: 2025,
      website: accessibleSites[0] ?? "example.com",
      userEarnings: 1200,
      adminProfit: 300,
      status: "Paid",
      paymentDate: "2024-02-05",
    },
    {
      month: "February",
      year: 2025,
      website: accessibleSites[0] ?? "example.com",
      userEarnings: 800,
      adminProfit: 200,
      status: "Pending",
      paymentDate: null,
    },
    // Second site demo data — only generated when a second site exists
    ...(accessibleSites[1]
      ? [
          {
            month: "January",
            year: 2024,
            website: accessibleSites[1],
            userEarnings: 950,
            adminProfit: 150,
            status: "Paid" as const,
            paymentDate: "2024-02-07",
          },
          {
            month: "February",
            year: 2024,
            website: accessibleSites[1],
            userEarnings: 620,
            adminProfit: 80,
            status: "Pending" as const,
            paymentDate: null,
          },
        ]
      : []),
  ];

  useEffect(() => {
    setPayments(demoPayments);
    // When you add a real API call, put it here:
    // setIsLoading(true);
    // fetchPayments(userId).then(setPayments).finally(() => setIsLoading(false));
  }, []);

  // Sites to show — prefer the prop so every accessible site gets a table,
  // even if it has no payments yet. Fall back to unique sites in payment data.
  const sites =
    accessibleSites.length > 0
      ? accessibleSites
      : [...new Set(payments.map((p) => p.website))];

  const paymentsForSite = (site: string) =>
    payments.filter((p) => p.website === site);

  // ── Global totals (all sites combined) ──────────────────────────────────
  const totalEarnings = payments.reduce((s, p) => s + p.userEarnings, 0);
  const pendingPayments = payments.filter((p) => p.status === "Pending");
  const paidPayments = payments.filter((p) => p.status === "Paid");
  const totalPending = pendingPayments.reduce((s, p) => s + p.userEarnings, 0);
  const totalPaid = paidPayments.reduce((s, p) => s + p.userEarnings, 0);

  return (
    <div className="space-y-6">
      {/* ── Global summary cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {payments.length} payment{payments.length !== 1 ? "s" : ""} across{" "}
              {sites.length} site{sites.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              ${totalPending.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingPayments.length} pending payment
              {pendingPayments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${totalPaid.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {paidPayments.length} completed payment
              {paidPayments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Per-site payment tables ──────────────────────────────────────── */}
      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Loading payments…
          </CardContent>
        </Card>
      ) : sites.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No payment data found.
          </CardContent>
        </Card>
      ) : (
        sites.map((site) => {
          const sitePayments = paymentsForSite(site);
          const siteEarnings = sitePayments.reduce(
            (s, p) => s + p.userEarnings,
            0
          );
          const sitePending = sitePayments
            .filter((p) => p.status === "Pending")
            .reduce((s, p) => s + p.userEarnings, 0);
          const sitePaid = sitePayments
            .filter((p) => p.status === "Paid")
            .reduce((s, p) => s + p.userEarnings, 0);

          return (
            <Card key={site}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Site title + description */}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {site}
                    </CardTitle>
                    <CardDescription>
                      Payment history for {username} on {site}
                    </CardDescription>
                  </div>

                  {/* Per-site mini stat strip */}
                  <div className="flex gap-5 text-xs shrink-0">
                    <div className="text-right">
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold">
                        ${siteEarnings.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Pending</p>
                      <p className="font-semibold text-yellow-600">
                        ${sitePending.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Paid</p>
                      <p className="font-semibold text-green-600">
                        ${sitePaid.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {sitePayments.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No payments recorded for {site} yet.
                  </p>
                ) : (
                  <DataTable columns={paymentColumns} data={sitePayments} />
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
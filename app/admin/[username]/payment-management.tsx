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
import { Payment, Sites } from "@/lib/types";
import { Globe } from "lucide-react";
import { getPaymentsForUser, getSitesAction } from "@/lib/server-actions";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Earnings {
  month: string;
  monthNumber: number;
  year: number;
  revenue: number;
}

interface PaymentManagementProps {
  userId: string;
  username: string;
  accessibleSites?: string[];
  canMarkPaid?: boolean;
}

export function PaymentManagement({
  userId,
  username,
  accessibleSites = [],
  canMarkPaid = false,
}: PaymentManagementProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allSitesData = await getSitesAction();
        const siteConfigs = (allSitesData as Sites[]).filter((site) =>
          accessibleSites.includes(site.domain),
        );

        if (siteConfigs.length === 0) {
          setPayments([]);
          return;
        }

        const dbPayments = await getPaymentsForUser(userId);

        const siteEarningsPromises = siteConfigs.map(async (site) => {
          const res = await fetch("/api/ga4/monthly-payments", {
            method: "POST",
            body: JSON.stringify({
              username,
              propertyId: site.propertyId,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const earnings: Earnings[] = await res.json();
          return { site, earnings };
        });

        const siteEarningsData = await Promise.all(siteEarningsPromises);

        const mergedPayments: Payment[] = siteEarningsData.flatMap(
          ({ site, earnings }) =>
            earnings.map((e) => {
              const payment = dbPayments.find(
                (p) =>
                  p.month === e.monthNumber &&
                  p.year === e.year &&
                  p.website === site.domain,
              );
              return {
                month: e.month,
                monthNumber: e.monthNumber,
                year: e.year,
                website: site.domain,
                userEarnings: e.revenue,
                adminProfit: e.revenue * 0.25,
                status: payment?.status || "Pending",
                paymentDate: payment?.paymentDate || null,
              };
            }),
        );

        setPayments(mergedPayments);
      } catch (error) {
        toast.error(`Error fetching data: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, username, accessibleSites]);

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
            0,
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
                      {/* <Globe className="h-4 w-4 text-muted-foreground" /> */}
                      <Avatar className="h-4 w-4 rounded-lg">
                        <AvatarImage
                          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(site)}&sz=64`}
                          alt={site}
                        />
                        <AvatarFallback className="rounded-lg">
                          {site
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
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
                  <DataTable
                    columns={paymentColumns(userId, canMarkPaid)}
                    data={sitePayments}
                  />
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

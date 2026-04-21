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

interface PaymentManagementProps {
  userId: string;
  username: string;
}

export function PaymentManagement({
  userId,
  username,
}: PaymentManagementProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const demoPayments: Payment[] = [
    {
      month: "January",
      year: 2024,
      website: "example.com",
      userEarnings: 1200,
      adminProfit: 300,
      status: "Paid",
      paymentDate: "2024-02-05",
    },
    {
      month: "February",
      year: 2024,
      website: "example.com",
      userEarnings: 800,
      adminProfit: 200,
      status: "Pending",
      paymentDate: null,
    },
  ];

  useEffect(() => {
    setPayments(demoPayments);
  },
  [])

  // Calculate totals
  const totalEarnings = payments.reduce((sum, p) => sum + p.userEarnings, 0);
  const totalPending = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.userEarnings, 0);
  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.userEarnings, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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
              From {payments.length} payments
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
              {payments.filter((p) => p.status === "Pending").length} payments
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
              {payments.filter((p) => p.status === "Paid").length} payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Manage payments from {username}'s multiple websites
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <DataTable columns={paymentColumns} data={payments} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

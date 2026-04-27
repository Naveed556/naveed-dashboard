import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { BadgeCheckIcon, Clock10Icon } from "lucide-react";
import { Payment } from "@/lib/types";
import { updatePaymentStatus } from "@/lib/server-actions";

export const paymentColumns = (
  userId: string,
  canMarkPaid: boolean,
): ColumnDef<Payment>[] => [
  {
    accessorKey: "month",
    header: "Payment Month",
    cell: ({ row }) => {
      const payment = row.original;
      return `${payment.month} ${payment.year}`;
    },
  },
  {
    accessorKey: "userEarnings",
    header: "Your Earnings",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <span className="font-semibold text-green-600">
          ${payment.userEarnings.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "adminProfit",
    header: "Admin Profit",
    cell: ({ row }) => {
      const payment = row.original;
      return `$${payment.adminProfit.toFixed(2)}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Badge
          variant={"outline"}
          className={`${payment.status === "Paid" ? "text-green-600" : "text-yellow-600"}`}
        >
          {payment.status === "Paid" ? (
            <BadgeCheckIcon className="w-3 h-3 mr-1" />
          ) : (
            <Clock10Icon className="w-3 h-3 mr-1" />
          )}
          {payment.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => {
      const payment = row.original;
      if (payment.status === "Paid") {
        return payment.paymentDate
          ? new Date(payment.paymentDate).toLocaleDateString()
          : "N/A";
      } else if (canMarkPaid) {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await updatePaymentStatus(
                userId,
                payment.monthNumber,
                payment.year,
                payment.website,
                "Paid",
              );
            }}
          >
            Mark as Paid
          </Button>
        );
      }

      return "N/A";
    },
  },
];

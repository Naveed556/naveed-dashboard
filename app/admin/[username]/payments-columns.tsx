import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { BadgeCheckIcon, Clock10Icon } from "lucide-react";

export interface Payments {
  month: string;
  amount: number;
  status: "Pending" | "Paid";
}

export const paymentsColumns: ColumnDef<Payments>[] = [
  {
    accessorKey: "month",
    header: "Month",
  },
  {
    accessorKey: "amount",
    header: "Amount",
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
          {payment.status === "Paid" ? <BadgeCheckIcon/> : <Clock10Icon/>}
          {payment.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
  },
];

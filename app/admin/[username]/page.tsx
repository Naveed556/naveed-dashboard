"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  gender: string;
  commission: number;
  createdAt: Date;
  avatar?: string;
}

interface Payment {
  id: string;
  amount: number;
  status: "paid" | "pending";
  date: Date;
  description: string;
}

interface Earning {
  date: string;
  amount: number;
}

export default function UserStats({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const paramsData = await params;
      const searchParamsData = await searchParams;

      setUsername(paramsData.username);
      setUserId((searchParamsData.id as string) || "");

      // Mock user data - in real app, fetch from API
      const mockUser: User = {
        id: (searchParamsData.id as string) || "1",
        username: paramsData.username,
        email: `${paramsData.username}@example.com`,
        name:
          paramsData.username.charAt(0).toUpperCase() +
          paramsData.username.slice(1),
        gender: "male",
        commission: 5.5,
        createdAt: new Date("2024-01-15"),
        avatar: undefined,
      };
      setUser(mockUser);
      setEditForm(mockUser);

      // Mock payments data
      const mockPayments: Payment[] = [
        {
          id: "1",
          amount: 100,
          status: "paid",
          date: new Date("2024-04-10"),
          description: "Premium subscription",
        },
        {
          id: "2",
          amount: 50,
          status: "pending",
          date: new Date("2024-04-15"),
          description: "Service fee",
        },
        {
          id: "3",
          amount: 75,
          status: "paid",
          date: new Date("2024-04-08"),
          description: "Consultation",
        },
        {
          id: "4",
          amount: 200,
          status: "paid",
          date: new Date("2024-04-05"),
          description: "Project payment",
        },
      ];
      setPayments(mockPayments);

      // Mock earnings data for last 30 days
      const mockEarnings: Earning[] = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        mockEarnings.push({
          date: format(date, "yyyy-MM-dd"),
          amount: Math.floor(Math.random() * 500) + 50,
        });
      }
      setEarnings(mockEarnings);

      // Set default date range to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      setDateFrom(thirtyDaysAgo);
      setDateTo(today);
    };

    fetchData();
  }, [params, searchParams]);

  const handleEditUser = () => {
    if (user && editForm) {
      setUser({ ...user, ...editForm });
      setIsEditing(false);
    }
  };

  const filteredEarnings = earnings.filter((earning) => {
    if (!dateFrom || !dateTo) return true;
    const earningDate = new Date(earning.date);
    return earningDate >= dateFrom && earningDate <= dateTo;
  });

  const totalEarnings = filteredEarnings.reduce(
    (sum, earning) => sum + earning.amount,
    0,
  );
  const paidPayments = payments.filter((p) => p.status === "paid");
  const pendingPayments = payments.filter((p) => p.status === "pending");

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* User Information Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Information</CardTitle>
              <CardDescription>View and edit user details</CardDescription>
            </div>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User Information</DialogTitle>
                  <DialogDescription>
                    Make changes to the user information here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">
                      Gender
                    </Label>
                    <Select
                      value={editForm.gender || ""}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, gender: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="commission" className="text-right">
                      Commission (%)
                    </Label>
                    <Input
                      id="commission"
                      type="number"
                      step="0.1"
                      value={editForm.commission || 0}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          commission: parseFloat(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditUser}>Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{user.gender}</Badge>
                <Badge variant="outline">Commission: {user.commission}%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Joined {format(user.createdAt, "PPP")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Track paid and pending payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="text-lg font-semibold text-green-600">
                Paid Payments
              </h4>
              <p className="text-2xl font-bold">{paidPayments.length}</p>
              <p className="text-sm text-muted-foreground">
                Total: ${paidPayments.reduce((sum, p) => sum + p.amount, 0)}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="text-lg font-semibold text-yellow-600">
                Pending Payments
              </h4>
              <p className="text-2xl font-bold">{pendingPayments.length}</p>
              <p className="text-sm text-muted-foreground">
                Total: ${pendingPayments.reduce((sum, p) => sum + p.amount, 0)}
              </p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "paid" ? "default" : "secondary"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(payment.date, "PPP")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Earnings Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Earnings</CardTitle>
          <CardDescription>
            View earnings over time with customizable date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="grid gap-2">
              <Label htmlFor="date-from">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-60 justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date-to">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-60 justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  setDateFrom(thirtyDaysAgo);
                  setDateTo(new Date());
                }}
              >
                Last 30 Days
              </Button>
            </div>
          </div>
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold">Total Earnings</h4>
            <p className="text-3xl font-bold text-green-600">
              ${totalEarnings}
            </p>
            <p className="text-sm text-muted-foreground">
              From {dateFrom ? format(dateFrom, "PPP") : "N/A"} to{" "}
              {dateTo ? format(dateTo, "PPP") : "N/A"}
            </p>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Earnings Chart Placeholder</p>
            <p className="text-xs mt-2">
              Chart component would be implemented here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

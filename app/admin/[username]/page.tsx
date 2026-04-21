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
import { format } from "date-fns";
import { PaymentManagement } from "./payment-management";

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

export default function UserStats({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const paramsData = await params;
      const searchParamsData = await searchParams;

      setUsername(paramsData.username);
      setUserId((searchParamsData.id as string) || "user1");

      // Mock user data - in real app, fetch from API
      const mockUser: User = {
        id: (searchParamsData.id as string) || "user1",
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
    };

    fetchData();
  }, [params, searchParams]);

  const handleEditUser = () => {
    if (user && editForm) {
      setUser({ ...user, ...editForm });
      setIsEditing(false);
    }
  };

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

      {/* Payment Management Component */}
      <PaymentManagement userId={userId} username={username} />
    </div>
  );
}

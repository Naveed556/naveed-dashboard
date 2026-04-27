"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { format } from "date-fns";
import { PaymentManagement } from "./payment-management";
import {
  getUser,
  getSitesAction,
  updateUserAction,
} from "@/lib/server-actions";
import type { Sites, User } from "@/lib/types";
import {
  BanknoteIcon,
  Check,
  ChevronsUpDown,
  SquarePenIcon,
  WalletIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import RevenueReport from "./revenue-report";

export default function UserStats({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    gender: string;
    commission: number;
    accessibleSites: string[];
  }>({
    name: "",
    email: "",
    gender: "male",
    commission: 0,
    accessibleSites: [],
  });
  const [availableSites, setAvailableSites] = useState<Sites[]>([]);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("payments");
  const router = useRouter();

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("tab", value);
    router.replace(
      `${window.location.pathname}?${newSearchParams.toString()}`,
      { scroll: false },
    );
  };

  useEffect(() => {
    const loadSites = async () => {
      try {
        const allSites = await getSitesAction();
        setAvailableSites(allSites);
      } catch (error) {
        toast.error(`Failed to load available sites: ${error}`);
      }
    };

    loadSites();
  }, []);

  useEffect(() => {
    if (!isEditing || !user) return;

    const accessibleSitesFromUser =
      (user as any).accessibleSites ??
      (user as any).data?.accessibleSites ??
      [];

    setEditForm({
      name: user.name ?? "",
      email: user.email ?? "",
      gender: (user as any).gender ?? (user as any).data?.gender ?? "male",
      commission:
        typeof user.commission === "number"
          ? user.commission
          : typeof (user as any).data?.commission === "number"
            ? (user as any).data?.commission
            : 0,
      accessibleSites: Array.isArray(accessibleSitesFromUser)
        ? accessibleSitesFromUser
        : [],
    });
  }, [isEditing, user]);

  useEffect(() => {
    const fetchData = async () => {
      const paramsData = await params;
      const searchParamsData = await searchParams;

      const userIdFromParams = (searchParamsData.id as string) || "";
      const tabFromParams = (searchParamsData.tab as string) || "payments";
      setUsername(paramsData.username);
      setUserId(userIdFromParams);
      setCurrentTab(tabFromParams);

      try {
        const userData = await getUser(userIdFromParams);
        if (userData) {
          const typedUser = userData as unknown as User;
          setUser(typedUser);

          const accessibleSitesFromUser =
            (typedUser as any).accessibleSites ??
            (typedUser as any).data?.accessibleSites ??
            [];

          setEditForm({
            name: typedUser.name ?? "",
            email: typedUser.email ?? "",
            gender:
              (typedUser as any).gender ??
              (typedUser as any).data?.gender ??
              "male",
            commission:
              typeof typedUser.commission === "number"
                ? typedUser.commission
                : typeof (typedUser as any).data?.commission === "number"
                  ? (typedUser as any).data?.commission
                  : 0,
            accessibleSites: Array.isArray(accessibleSitesFromUser)
              ? accessibleSitesFromUser
              : [],
          });
        }
      } catch (error) {
        toast.error(`Failed to fetch user: ${error}`);
      }
    };

    fetchData();
  }, [params, searchParams]);

  const handleEditUser = async () => {
    if (!userId) return;

    setSaving(true);
    const toastId = toast.loading("Saving changes...");

    try {
      const updatedUser = await updateUserAction(userId, {
        name: editForm.name,
        email: editForm.email,
        gender: editForm.gender,
        commission: editForm.commission,
        accessibleSites: editForm.accessibleSites,
      });

      if (updatedUser) {
        setUser(updatedUser);
      }
      setIsEditing(false);
      toast.success("User updated successfully.");
    } catch (error) {
      toast.error(
        `Could not update user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      toast.dismiss(toastId);
      setSaving(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // accessibleSites may live directly on the user or nested under user.data
  const accessibleSites: string[] =
    (user as any).accessibleSites ?? (user as any).data?.accessibleSites ?? [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ── User Information Section ─────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Information</CardTitle>
              <CardDescription>View and edit user details</CardDescription>
            </div>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <SquarePenIcon /> Edit User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User Information</DialogTitle>
                  <DialogDescription>
                    Update any field or website access assignment for this user.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <FieldGroup>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Full name"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          placeholder="user@example.com"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="gender">Gender</FieldLabel>
                        <Select
                          value={editForm.gender}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, gender: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="commission">
                          Commission (%)
                        </FieldLabel>
                        <Input
                          id="commission"
                          type="number"
                          step="0.1"
                          min={0}
                          max={100}
                          onFocus={(e) => e.target.select()}
                          value={editForm.commission}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              commission: Number(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>Accessible Sites</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {editForm.accessibleSites.length > 0
                              ? `${editForm.accessibleSites.length} site${
                                  editForm.accessibleSites.length > 1 ? "s" : ""
                                } selected`
                              : "Select websites..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search websites..." />
                            <CommandList>
                              <CommandEmpty>No website found.</CommandEmpty>
                              <CommandGroup>
                                {availableSites.map((site) => (
                                  <CommandItem
                                    key={site.domain}
                                    value={site.domain}
                                    onSelect={() =>
                                      setEditForm((prev) => {
                                        const selected =
                                          prev.accessibleSites.includes(
                                            site.domain,
                                          )
                                            ? prev.accessibleSites.filter(
                                                (value) =>
                                                  value !== site.domain,
                                              )
                                            : [
                                                ...prev.accessibleSites,
                                                site.domain,
                                              ];

                                        return {
                                          ...prev,
                                          accessibleSites: selected,
                                        };
                                      })
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        editForm.accessibleSites.includes(
                                          site.domain,
                                        )
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {site.domain}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </Field>
                  </FieldGroup>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditUser} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image as string} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 flex-wrap">
                {user.gender && (
                  <Badge variant="secondary">{user.gender}</Badge>
                )}
                {user.commission !== undefined && (
                  <Badge variant="outline">
                    Commission: {user.commission}%
                  </Badge>
                )}
                {accessibleSites.map((site) => (
                  <Badge key={site} variant="default">
                    {site}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Joined {format(new Date(user.createdAt), "PPP")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="payments">
            <WalletIcon />
            Payment Information
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <BanknoteIcon />
            Revenue Report
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ── Payment Management ───────────────────────────── */}
      {currentTab === "payments" ? (
        <PaymentManagement
          userId={userId}
          username={username}
          user={user}
          accessibleSites={accessibleSites}
          canMarkPaid={true}
        />
      ) : (
        <RevenueReport username={username} accessibleSites={accessibleSites} />
      )}
    </div>
  );
}

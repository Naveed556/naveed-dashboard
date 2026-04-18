"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import {
  MoreHorizontal,
  Ban,
  Trash2,
  BadgeCheckIcon,
  CircleDotIcon,
  ArrowUpDown,
  SquareUserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserWithRole } from "better-auth/plugins";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface User extends UserWithRole {
  commission: number;
  username: string;
}

const BanUser = async (user: User) => {
  await authClient.admin.banUser(
    {
      userId: user.id,
    },
    {
      onRequest: () => {
        toast.loading(`Banning user ${user.name}...`);
      },
      onSuccess: () => {
        toast.dismiss();
        toast.success(`User ${user.name} banned successfully!`);
      },
      onError: (ctx) => {
        toast.dismiss();
        toast.error(`Error while banning user: ${ctx.error.message}`);
      },
    },
  );
};

const UnbanUser = async (user: User) => {
  await authClient.admin.unbanUser(
    {
      userId: user.id,
    },
    {
      onRequest: () => {
        toast.loading(`Unbanning user ${user.name}...`);
      },
      onSuccess: () => {
        toast.dismiss();
        toast.success(`User ${user.name} unbanned successfully!`);
      },
      onError: (ctx) => {
        toast.dismiss();
        toast.error(`Error while unbanning user: ${ctx.error.message}`);
      },
    },
  );
};

const DeleteUser = async (user: User) => {
  await authClient.admin.removeUser(
    {
      userId: user.id,
    },
    {
      onRequest: () => {
        toast.loading(`Deleting user ${user.name}...`);
      },
      onSuccess: () => {
        toast.dismiss();
        toast.success(`User ${user.name} deleted successfully!`);
      },
      onError: (ctx) => {
        toast.dismiss();
        toast.error(`Error while deleting user: ${ctx.error.message}`);
      },
    },
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Avatar>
          <AvatarImage src={user.image as string} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-1">
          <a
            href={`mailto:${user.email}`}
            target="_blank"
            className="hover:underline"
          >
            {user.email}
          </a>
          {user.emailVerified && (
            <BadgeCheckIcon className="size-4 text-primary" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "commission",
    header: "Commission",
    cell: ({ row }) => {
      const user = row.original;
      return `${user.commission}%`;
    },
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge variant={user.banned ? "destructive" : "secondary"}>
          <CircleDotIcon
            className={user.banned ? "text-destructive" : "text-primary"}
          />
          {user.banned ? "Banned" : "Active"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/admin/${user.username}?id=${user.id}`} passHref>
              <DropdownMenuItem>
                <SquareUserIcon className="mr-2 h-4 w-4" />
                View User
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            {user.banned ? (
              <DropdownMenuItem onClick={() => UnbanUser(user)}>
                <Ban className="mr-2 h-4 w-4" /> Unban
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => BanUser(user)}>
                <Ban className="mr-2 h-4 w-4" /> Ban
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              variant="destructive"
              onClick={() => DeleteUser(user)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

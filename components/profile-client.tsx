"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { SquarePenIcon, KeyRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { updateCurrentUserProfile, updatePassword } from "@/lib/server-actions";
import { normalizeGenderSelect } from "@/lib/gender";

type ProfileClientProps = {
  user: User;
};

export function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [username, setUsername] = useState(user.username ?? "");
  const [gender, setGender] = useState(() =>
    normalizeGenderSelect(user.gender),
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetEditForm = () => {
    setName(user.name ?? "");
    setUsername(user.username ?? "");
    setGender(normalizeGenderSelect(user.gender));
  };

  const handleOpenEdit = (open: boolean) => {
    setEditOpen(open);
    if (open) {
      resetEditForm();
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!username.trim() && user.role !== "admin") {
      toast.error("Username is required.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving profile...");
    try {
      await updateCurrentUserProfile({
        name: name.trim(),
        username: username.trim(),
        gender,
      });
      toast.success("Profile updated.");
      setEditOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update profile.",
      );
    } finally {
      toast.dismiss(toastId);
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Fill in all password fields.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Updating password...");
    try {
      await updatePassword(currentPassword, newPassword, confirmPassword);
      toast.success("Password updated.");
      setPasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update password.",
      );
    } finally {
      toast.dismiss(toastId);
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Dialog open={editOpen} onOpenChange={handleOpenEdit}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            <SquarePenIcon className="size-4" />
            Edit profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your display name, username, and gender. Site access and
              commission are managed by an administrator.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4 py-2">
            <Field>
              <FieldLabel htmlFor="profile-name">Name</FieldLabel>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </Field>
            {/* only allow admin to change username */}
            {user.role === "admin" && (
              <Field>
                <FieldLabel htmlFor="profile-username">Username</FieldLabel>
                <Input
                  id="profile-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  autoComplete="username"
                />
              </Field>
            )}
            <Field>
              <FieldLabel>Gender</FieldLabel>
              <Select
                value={gender}
                onValueChange={(v) => setGender(v as "male" | "female")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={passwordOpen}
        onOpenChange={(open) => {
          setPasswordOpen(open);
          if (!open) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }
        }}
      >
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            <KeyRoundIcon className="size-4" />
            Change password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one. Other sessions
              will be signed out.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4 py-2">
            <Field>
              <FieldLabel htmlFor="current-password">
                Current password
              </FieldLabel>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm new password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleChangePassword}
              disabled={saving}
            >
              {saving ? "Updating…" : "Update password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect, useSearchParams } from "next/navigation";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { resetpasswordAction } from "@/lib/server-actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (searchParams.has("token")) {
      setToken(searchParams.get("token") as string);
    } else {
      redirect("/auth/forgot-password");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (newPassword != confirmPassword) {
        toast.error(
          "Passwords do not match. Please make sure both password fields are the same.",
        );
        return;
      }
      await resetpasswordAction(token, newPassword, confirmPassword);
      toast.success("Password Reset Successfully");
      redirect("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error while resetting password, please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Please enter new password on both fields to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                <Input
                  id="newPassword"
                  type="text"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="text"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Field>
            </FieldGroup>
            <Button type="submit" className="w-full" disabled={submitting}>
              Reset Password{" "}
              {submitting && <Loader2Icon className="animate-spin" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

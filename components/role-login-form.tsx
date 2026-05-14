"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import {
  type AuthRole,
  getRoleHomePath,
  getRoleLabel,
  getRoleLoginPath,
  hasAuthRole,
} from "@/lib/auth-roles";
import { Email } from "@/lib/constants";

interface RoleLoginFormProps {
  targetRole: AuthRole;
  title: string;
  description: string;
}

export function RoleLoginForm({
  targetRole,
  title,
  description,
}: RoleLoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const targetLabel = getRoleLabel(targetRole);
  const otherRole = targetRole === "admin" ? "user" : "admin";

  const revokeMismatchedSession = async (data: unknown) => {
    const token = (data as { session?: { token?: unknown } })?.session?.token;
    if (typeof token !== "string") {
      return;
    }

    await authClient.multiSession
      .revoke({
        sessionToken: token,
      })
      .catch(() => undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.username({
        username,
        password,
      });

      if (error) {
        toast.error("Login failed: " + error.message);
        return;
      }

      if (!data?.user) {
        toast.error("Login failed. Please try again.");
        return;
      }

      if (!hasAuthRole(data.user, targetRole)) {
        await revokeMismatchedSession(data);
        toast.error(
          `That account is not a ${targetLabel} account. Use the ${getRoleLabel(otherRole)} login instead.`,
        );
        return;
      }

      toast.success(
        targetRole === "admin"
          ? "Welcome back, admin!"
          : "Login successful!",
      );
      router.push(getRoleHomePath(targetRole));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${targetRole}-username`}>
                  Username
                </FieldLabel>
                <Input
                  id={`${targetRole}-username`}
                  type="text"
                  placeholder="johndoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor={`${targetRole}-password`}>
                    Password
                  </FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-xs text-primary underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id={`${targetRole}-password`}
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((value) => !value)}
                    className="absolute top-1.5 right-1.5 cursor-pointer text-muted-foreground transition-colors hover:text-primary"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <EyeOffIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={submitting}
                  className={
                    submitting
                      ? "bg-muted text-muted-foreground cursor-progress"
                      : ""
                  }
                >
                  {targetRole === "admin" ? "Admin Login" : "User Login"}
                  {submitting && (
                    <Loader2Icon className="ml-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Need the {getRoleLabel(otherRole)} page?{" "}
                  <Link href={getRoleLoginPath(otherRole)}>Switch login</Link>
                </FieldDescription>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link target="_blank" href={`mailto:${Email}`}>
                    Contact Us
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        We are no longer offering Self Registration. If you would like an
        account, please email us at:{" "}
        <Link target="_blank" href={`mailto:${Email}`}>
          {Email}
        </Link>{" "}
        <br />
        By clicking continue, you agree to our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}

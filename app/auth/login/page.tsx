"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
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
import { Email } from "@/lib/constants";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await authClient.signIn.username({
      username,
      password,
    });
    if (error) {
      toast.error("Login failed: " + error.message);
    } else if (data) {
      if (data?.user?.role === "admin") {
        toast.success("Welcome back, admin!");
        router.push("/admin");
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-xs text-primary underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-8"
                  />
                  {showPass ? (
                    <EyeOffIcon
                      onClick={() => setShowPass(!showPass)}
                      className="size-5 hover:text-primary transition-colors absolute top-1.5 right-1.5 cursor-pointer"
                    />
                  ) : (
                    <EyeIcon
                      onClick={() => setShowPass(!showPass)}
                      className="size-5 hover:text-primary transition-colors absolute top-1.5 right-1.5 cursor-pointer"
                    />
                  )}
                </div>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={submitting}
                  className={`${submitting ? "bg-muted text-muted-foreground cursor-progress" : ""}`}
                >
                  Login{" "}
                  {submitting && (
                    <Loader2Icon className="ml-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                </Button>
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

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, Loader2Icon, PlusIcon } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { revalidateUsersAction } from "@/lib/server-actions";

export default function CreateUserForm() {
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fullname, setFullname] = useState("");
  const [gender, setGender] = useState("male");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [commission, setCommission] = useState(0);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match. Please make sure both password fields are the same.",
      );
      return;
    }

    const { data: usernameResponse, error: usernameError } =
      await authClient.isUsernameAvailable({
        username,
      });
    if (!usernameResponse?.available) {
      toast.error(
        "Username already exists. Please choose a different username.",
      );
      return;
    } else if (usernameError) {
      toast.error(
        `Error while checking username availability: ${usernameError}`,
      );
      return;
    }

    await authClient.admin.createUser(
      {
        name: fullname
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        email,
        password,
        role: "user",
        data: {
          username: username.toLowerCase(),
          gender,
          image: `${gender === "male" ? "/male_profile.png" : "/female_profile.png"}`,
          commission,
        },
      },
      {
        onRequest: () => {
          setSubmitting(true);
        },
        onSuccess: async () => {
          await revalidateUsersAction();
          toast.success(
            "Account created successfully! Please check your email to verify your account.",
          );
          setSubmitting(false);
          setFullname("");
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setCommission(0);
        },
        onError: (ctx) => {
          toast.error(`Error while creating Account: ${ctx.error.message}`);
          setSubmitting(false);
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          <span className="hidden lg:inline">Create User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new user account.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="John Doe"
                required
              />
            </Field>
            <Field>
              <Field className="grid grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe123"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="commission">Commission %</FieldLabel>
                  <Input
                    id="commission"
                    type="number"
                    min={0}
                    max={100}
                    value={commission}
                    onChange={(e) => setCommission(parseInt(e.target.value))}
                    required
                  />
                </Field>
              </Field>
            </Field>
            <Field>
              <FieldLabel htmlFor="gender">Gender</FieldLabel>
              <RadioGroup
                defaultValue="male"
                className="flex items-center justify-around"
                onValueChange={(value) => setGender(value)}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@example.com"
                required
              />
            </Field>
            <Field>
              <Field className="grid grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
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
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
              </Field>
              <FieldDescription>
                Password must be at least 8 characters long.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="submit"
              disabled={submitting}
              className={`${submitting ? "bg-muted text-muted-foreground cursor-progress" : ""}`}
            >
              Create Account{" "}
              {submitting && (
                <Loader2Icon className="ml-1.5 h-3.5 w-3.5 animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
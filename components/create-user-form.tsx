"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  PlusIcon,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createUserAction, getSitesAction } from "@/lib/server-actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
import { cn } from "@/lib/utils";
import { Sites } from "@/lib/types";

export default function CreateUserForm() {
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fullname, setFullname] = useState("");
  const [gender, setGender] = useState("male");
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [sites, setSites] = useState<Sites[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [commission, setCommission] = useState(0);

  useEffect(() => {
    const getAllSites = async () => {
      const fetchedSites = await getSitesAction();
      console.log(fetchedSites);
      setSites(fetchedSites);
    };
    getAllSites();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading("Creating user...");
    try {
      await createUserAction(
        fullname,
        gender,
        username,
        email,
        password,
        confirmPassword,
        commission,
        selectedSites,
      );
      toast.dismiss(toastId);
      toast.success(`User ${fullname} created successfully!`);
      setSubmitting(false);
      setFullname("");
      setGender("male");
      setSelectedSites([]);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCommission(0);
    } catch (error) {
      setSubmitting(false);
      toast.dismiss(toastId);
      toast.error(
        `Error creating user: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
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
        <form onSubmit={handleSubmit}>
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
                    onFocus={(e) => e.target.select()}
                    value={commission}
                    onChange={(e) => setCommission(parseInt(e.target.value))}
                    required
                  />
                </Field>
              </Field>
            </Field>
            <Field className="grid grid-cols-2">
              <Field>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <Select
                  defaultValue="male"
                  onValueChange={(value) => setGender(value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Websites</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedSites.length > 0
                        ? `${selectedSites.length} site${selectedSites.length > 1 ? "s" : ""} selected`
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
                          {sites.map((site) => (
                            <CommandItem
                              key={site.domain}
                              value={site.domain}
                              onSelect={() => {
                                setSelectedSites((prev) =>
                                  prev.includes(site.domain)
                                    ? prev.filter((s) => s !== site.domain)
                                    : [...prev, site.domain],
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedSites.includes(site.domain)
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

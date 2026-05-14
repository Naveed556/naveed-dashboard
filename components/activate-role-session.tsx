"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function ActivateRoleSession({
  sessionToken,
  homePath,
  loginPath,
  label,
}: {
  sessionToken: string;
  homePath: string;
  loginPath: string;
  label: string;
}) {
  const router = useRouter();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) {
      return;
    }
    attempted.current = true;

    void authClient.multiSession
      .setActive({
        sessionToken,
      })
      .then(({ error }) => {
        if (error) {
          toast.error(`Please sign in with your ${label} account.`);
          router.replace(loginPath);
          return;
        }

        router.replace(homePath);
        router.refresh();
      })
      .catch(() => {
        toast.error(`Please sign in with your ${label} account.`);
        router.replace(loginPath);
      });
  }, [homePath, label, loginPath, router, sessionToken]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-sm text-muted-foreground">
      <Loader2Icon className="size-5 animate-spin text-primary" />
      Switching to your {label} session...
    </div>
  );
}

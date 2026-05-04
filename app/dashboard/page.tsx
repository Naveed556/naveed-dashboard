import { Suspense } from "react";
import Profile from "@/components/profile";
import { MainInsetLoadingFallback } from "@/components/layout-loading-fallbacks";

export default async function User() {
  return (
    <Suspense fallback={<MainInsetLoadingFallback />}>
      <Profile />
    </Suspense>
  );
}

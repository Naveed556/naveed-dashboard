import { Loader2Icon } from "lucide-react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className="size-30 animate-spin text-primary"
      />
    </div>
  );
}

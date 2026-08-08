import { cn } from "@/lib/utils";

/** Loading placeholder block with the identity's shimmer sweep. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-xl bg-muted", className)}
      {...props}
    />
  );
}

import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  // Rotate an HTML wrapper, not the <svg>: transforms on the wrapper are
  // GPU-composited in every browser (react-best-practices
  // rendering-animate-svg-wrapper).
  return (
    <span role="status" aria-label="Loading" className="inline-flex animate-spin">
      <Loader2Icon aria-hidden="true" className={cn("size-4", className)} {...props} />
    </span>
  )
}

export { Spinner }

"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { installCommand } from "./catalog";
import { cn } from "@/lib/utils";

/**
 * The half of a registry that actually distributes anything: the exact line you
 * paste to get the component you are looking at. Shown next to every preview.
 */
export function InstallCommand({ name, className }: { name: string; className?: string }) {
  const command = installCommand(name);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Clipboard is unavailable (insecure context, denied permission). The
      // command is selectable text either way, so there is nothing to recover.
      setCopied(false);
    }
  }

  return (
    <div
      className={cn(
        "surface-recessed flex min-w-0 items-center gap-2 rounded-lg px-3 py-2",
        className
      )}
    >
      <code className="min-w-0 flex-1 font-mono text-xs break-all text-muted-foreground">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy install command for ${name}`}
        className="focus-ring shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

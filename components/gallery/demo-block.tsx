import type { ReactNode } from "react";

import { InstallCommand } from "./install-command";

/**
 * Wall-label-annotated demo container used by every category page: the label,
 * the component running for real, and the line that installs it.
 */
export function DemoBlock({
  label,
  items,
  children,
}: {
  label: string;
  /** Registry item names this demo shows — one install line is rendered each. */
  items?: readonly string[];
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="label-mono mb-3">{label}</p>
      <div className="surface rounded-2xl card-padding-sm">{children}</div>
      {items && items.length > 0 && (
        <div className="mt-3 grid gap-2">
          {items.map((name) => (
            <InstallCommand key={name} name={name} />
          ))}
        </div>
      )}
    </div>
  );
}

import type { ReactNode } from "react";

/** Wall-label-annotated demo container used by every category page. */
export function DemoBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="label-mono mb-3">{label}</p>
      <div className="surface rounded-2xl card-padding-sm">{children}</div>
    </div>
  );
}

import { InstallCommand } from "./install-command";

/**
 * For registry items that genuinely cannot be shown as a static preview — a
 * hook, a stylesheet, a component that only does anything against a live
 * stream. Says so plainly rather than faking a screenshot of nothing.
 */
export function NoPreviewCard({
  label,
  name,
  reason,
}: {
  label: string;
  name: string;
  reason: string;
}) {
  return (
    <div className="min-w-0">
      <p className="label-mono mb-3">{label}</p>
      <div className="surface-recessed rounded-2xl card-padding-sm">
        <p className="text-description-sm">{reason}</p>
      </div>
      <div className="mt-3">
        <InstallCommand name={name} />
      </div>
    </div>
  );
}

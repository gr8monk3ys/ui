"use client";

import { createContext, useContext, type ReactNode } from "react";

import { InstallCommand } from "./install-command";

/**
 * Heading level for demo labels, so demos nest under whatever heading the
 * page puts above them (h2 on a category page, h3 inside the catalog's
 * per-category sections). Keeps the outline free of skipped levels.
 */
const DemoHeadingLevel = createContext<2 | 3>(2);

export function DemoHeadingLevelProvider({
  level,
  children,
}: {
  level: 2 | 3;
  children: ReactNode;
}) {
  return <DemoHeadingLevel.Provider value={level}>{children}</DemoHeadingLevel.Provider>;
}

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
  const Heading = useContext(DemoHeadingLevel) === 3 ? "h3" : "h2";
  return (
    <div className="min-w-0">
      <Heading className="label-mono mb-3">{label}</Heading>
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

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CATALOG_TOTAL, CATEGORIES, PATTERN_ITEMS, installCommand } from "../components/gallery/catalog";

const ROOT = join(import.meta.dir, "..");
const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));
const registryNames: string[] = registry.items.map((i: { name: string }) => i.name);

const filed = [...CATEGORIES.flatMap((c) => c.items), ...PATTERN_ITEMS];

describe("gallery catalog", () => {
  test("files every registry item exactly once", () => {
    expect([...filed].sort()).toEqual([...registryNames].sort());
  });

  test("no item is filed under two categories", () => {
    expect(new Set(filed).size).toBe(filed.length);
  });

  test("the advertised total is the real total", () => {
    expect(CATALOG_TOTAL).toBe(registryNames.length);
  });

  test("install commands point at the published registry", () => {
    expect(installCommand("button")).toBe(
      "npx shadcn add https://ui.lscaturchio.xyz/r/button.json",
    );
  });
});

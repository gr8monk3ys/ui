import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));

describe("registry.json", () => {
  test("every declared source file exists", () => {
    for (const item of registry.items) {
      for (const file of item.files) {
        expect(existsSync(join(ROOT, file.path)), `${item.name}: ${file.path}`).toBe(true);
      }
    }
  });

  test("expected items are present", () => {
    const names = registry.items.map((i: { name: string }) => i.name).sort();
    expect(names).toEqual([
      "accordion", "active-nav-link", "avatar", "badge", "breadcrumb-nav",
      "button", "card", "reveal", "scroll-to-top", "section", "skeleton",
      "theme", "theme-toggle",
    ]);
  });

  test("built output exists for every item", () => {
    for (const item of registry.items) {
      expect(existsSync(join(ROOT, "public/r", `${item.name}.json`)), item.name).toBe(true);
    }
  });

  test("no item imports another registry component", () => {
    for (const item of registry.items) {
      for (const file of item.files) {
        if (!file.path.endsWith(".tsx") && !file.path.endsWith(".ts")) continue;
        const src = readFileSync(join(ROOT, file.path), "utf8");
        expect(src.includes("@/registry/"), `${file.path} has cross-registry import`).toBe(false);
      }
    }
  });
});

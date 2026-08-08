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

  const manifest = JSON.parse(readFileSync(join(ROOT, "registry-manifest.json"), "utf8"));

  test("registry matches the checked-in manifest exactly", () => {
    const names = registry.items.map((i: { name: string }) => i.name).sort();
    expect(names).toEqual(manifest.items);
    expect(names.length).toBeGreaterThanOrEqual(69);
  });

  test("collision names are ours (exactly one item each)", () => {
    for (const name of ["button", "card", "badge", "accordion", "avatar", "skeleton"]) {
      const items = registry.items.filter((i: { name: string }) => i.name === name);
      expect(items.length, name).toBe(1);
    }
  });

  test("every cross-item import is backed by a registryDependencies URL", () => {
    const importRe = /from\s+["']@\/(components\/ui|components\/patterns|hooks)\/([\w-]+)["']/g;
    for (const item of registry.items) {
      const declared = new Set(
        (item.registryDependencies ?? []).map((d: string) =>
          d.startsWith("http") ? d.split("/").pop()!.replace(/\.json$/, "") : d,
        ),
      );
      const ownFiles = new Set(
        item.files.map((f: { path: string }) => f.path.split("/").pop()!.replace(/\.(tsx?|css)$/, "")),
      );
      for (const file of item.files) {
        if (!/\.(ts|tsx)$/.test(file.path)) continue;
        const src = readFileSync(join(ROOT, file.path), "utf8");
        for (const m of src.matchAll(importRe)) {
          const dep = m[2];
          if (ownFiles.has(dep)) continue;
          expect(
            declared.has(dep),
            `${item.name}: ${file.path} imports ${dep} without registryDependencies entry`,
          ).toBe(true);
        }
      }
    }
  });

  test("built output exists for every item", () => {
    for (const item of registry.items) {
      expect(existsSync(join(ROOT, "public/r", `${item.name}.json`)), item.name).toBe(true);
    }
  });

});

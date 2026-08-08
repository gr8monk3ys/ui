/**
 * Vendors the upstream shadcn catalog into this registry.
 * - Fetches r/styles/new-york-v4/<name>.json for every catalog item we do
 *   not already own, plus the transitive registryDependencies closure.
 * - Rewrites imports to consumer-shaped paths.
 * - Writes sources to components/ui/ (ui/component), hooks/ (hook), lib/ (lib).
 * - Regenerates the imported items' entries in registry.json (ours stay).
 * - Writes registry-manifest.json (exact item set) and prints npm deps.
 * Idempotent: re-running overwrites vendored files and regenerated entries.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const BASE = "https://ui.shadcn.com/r/styles/new-york-v4";
const OUR_URL = "https://ui.lscaturchio.xyz/r";

/** Items we own; never imported, and cross-refs to them resolve to OUR registry. */
const OURS = new Set([
  "theme", "button", "card", "badge", "accordion", "avatar", "section",
  "theme-toggle", "reveal", "active-nav-link", "breadcrumb-nav",
  "scroll-to-top", "skeleton",
]);

/** Extra registryDependencies upstream relies on implicitly (filled in as the
 * dependency-consistency test finds gaps). item name -> dep item names. */
const EXTRA_DEPS: Record<string, string[]> = {
  dialog: ["button"],
};

/** The full upstream ui catalog (from r/index.json, 2026-08-08). */
const CATALOG = [
  "accordion","alert","alert-dialog","aspect-ratio","attachment","avatar",
  "badge","breadcrumb","bubble","button","button-group","calendar","card",
  "carousel","chart","checkbox","collapsible","combobox","command",
  "context-menu","dialog","direction","drawer","dropdown-menu","empty",
  "field","form","hover-card","input","input-group","input-otp","item","kbd",
  "label","marker","menubar","message","message-scroller","native-select",
  "navigation-menu","pagination","popover","progress","questionnaire",
  "radio-group","resizable","scroll-area","select","separator","sheet",
  "sidebar","skeleton","slider","sonner","spinner","switch","table","tabs",
  "textarea","toast","toggle","toggle-group","tooltip",
];

function rewriteImports(src: string): string {
  return src
    .replaceAll(/@\/registry\/[\w-]+\/ui\//g, "@/components/ui/")
    .replaceAll(/@\/registry\/[\w-]+\/hooks\//g, "@/hooks/")
    .replaceAll(/@\/registry\/[\w-]+\/lib\//g, "@/lib/")
    .replaceAll(/@\/registry\/[\w-]+\/components\//g, "@/components/");
}

function targetFor(filePath: string, fileType: string): string {
  const base = filePath.split("/").pop()!;
  if (fileType === "registry:hook") return `hooks/${base}`;
  if (fileType === "registry:lib") return `lib/${base}`;
  return `components/ui/${base}`;
}

const toImport = CATALOG.filter((n) => !OURS.has(n));
const fetched = new Map<string, any>();
/** Index-listed items whose per-style JSON upstream does not publish (their
 * own CLI 404s on these too). Recorded in the manifest, revisit on upstream
 * releases. */
const unavailable: string[] = [];
const queue = [...toImport];
while (queue.length) {
  const name = queue.shift()!;
  if (fetched.has(name) || OURS.has(name) || name === "utils") continue;
  const res = await fetch(`${BASE}/${name}.json`);
  if (res.status === 404) {
    unavailable.push(name);
    continue;
  }
  if (!res.ok) throw new Error(`fetch ${name}: ${res.status}`);
  const item = await res.json();
  fetched.set(name, item);
  for (const dep of item.registryDependencies ?? []) {
    if (!OURS.has(dep) && dep !== "utils" && !fetched.has(dep)) queue.push(dep);
  }
}

const npmDeps = new Set<string>();
const cssVarsCollected: Record<string, Record<string, Record<string, string>>> = {};
const generatedItems: any[] = [];

for (const [name, item] of [...fetched.entries()].sort()) {
  const files: any[] = [];
  for (const f of item.files ?? []) {
    const target = targetFor(f.path, f.type);
    const abs = join(ROOT, target);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, rewriteImports(f.content));
    const entry: any = { path: target, type: f.type };
    if (f.type === "registry:hook" || f.type === "registry:lib") {
      entry.target = target; // explicit target for non-ui files
    }
    files.push(entry);
  }
  for (const d of item.dependencies ?? []) npmDeps.add(d);
  if (item.cssVars && Object.keys(item.cssVars).length) cssVarsCollected[name] = item.cssVars;

  const regDeps: string[] = [];
  const depNames = [...(item.registryDependencies ?? []), ...(EXTRA_DEPS[name] ?? [])];
  for (const dep of depNames) {
    regDeps.push(dep === "utils" ? "utils" : `${OUR_URL}/${dep}.json`);
  }
  generatedItems.push({
    name,
    type: item.type ?? "registry:ui",
    title: item.title ?? name,
    description: item.description ?? `${name} (identity-styled).`,
    ...(item.dependencies?.length ? { dependencies: item.dependencies } : {}),
    ...(regDeps.length ? { registryDependencies: regDeps } : {}),
    files,
  });
}

// Merge into registry.json: keep our items, replace all previously generated ones.
const registryPath = join(ROOT, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const ourItems = registry.items.filter((i: any) => OURS.has(i.name));
registry.items = [...ourItems, ...generatedItems];
writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");

writeFileSync(
  join(ROOT, "registry-manifest.json"),
  JSON.stringify(
    {
      items: registry.items.map((i: any) => i.name).sort(),
      imported: [...fetched.keys()].sort(),
      unavailableUpstream: unavailable.sort(),
    },
    null,
    2,
  ) + "\n",
);

console.log(`imported ${fetched.size} items; registry now has ${registry.items.length}`);
if (unavailable.length) console.log("UNAVAILABLE upstream (404, recorded in manifest):", unavailable.join(", "));
console.log("npm deps needed:\n  bun add " + [...npmDeps].sort().join(" "));
if (Object.keys(cssVarsCollected).length) {
  console.log("cssVars collected from:", Object.keys(cssVarsCollected).join(", "));
}

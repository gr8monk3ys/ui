# Full shadcn Catalog Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the identity registry from 13 items to the full current shadcn/ui catalog (57+ new items), restyled to the lscaturchio identity, with category gallery pages and end-to-end verification.

**Architecture:** A deterministic importer script fetches upstream item JSON from `https://ui.shadcn.com/r/styles/new-york-v4/<name>.json`, resolves the transitive dependency closure (hooks like `use-mobile` included), rewrites `@/registry/new-york-v4/*` imports to consumer-shaped paths, writes sources into `components/ui|hooks/lib`, and regenerates the new-item entries in `registry.json` (cross-refs as URLs into our own registry). The identity restyle is applied per category, each category task also authoring its gallery page so the build is the compile-coverage gate. Existing sources move from `registry/ui|patterns` to `components/ui|patterns` first so in-repo paths equal consumer paths.

**Tech Stack:** Bun, Next.js 16, Tailwind v4, tw-animate-css, shadcn CLI v3, upstream deps per item (radix-ui, @base-ui/react, @shadcn/react, recharts, embla-carousel-react, react-day-picker, date-fns, cmdk, sonner, input-otp, react-resizable-panels, react-hook-form/zod as upstream declares).

## Global Constraints

- Bun only; Tailwind v4 CSS-first; never define `--spacing-*` in `@theme`.
- Collision policy — ours win, upstream NOT imported for: `accordion`, `avatar`, `badge`, `button`, `card`, `skeleton`.
- Cross-item imports are consumer paths (`@/components/ui/x`, `@/hooks/x`, `@/lib/x`); every such import must be backed by `registryDependencies: ["https://ui.lscaturchio.xyz/r/<x>.json"]` — except `@/lib/utils`, which stays the bare `"utils"` registry dependency.
- Per-app knobs stay `--primary` + `--radius` only. All restyle work uses theme tokens; no hard-coded colors.
- Identity restyle checklist (from spec, applied per component): (1) flat surfaces — replace `shadow-md`/`shadow-lg`/`shadow-xl` with border + at most `shadow-sm`; floating layers keep `bg-popover` + hairline border; dialog/sheet/drawer may use `glass-heavy`; (2) radii — interactive `rounded-xl`, floating containers `rounded-2xl`, keep upstream sizing for small inline elements; (3) `label-mono` for micro-metadata (table `<th>`, kbd, command shortcuts, calendar weekday row); (4) focus rings stay `ring-ring`; selected states may tint `bg-primary/5..10` where upstream used grey, menus may keep `bg-accent`; (5) tokens only; (6) preserve upstream JSX structure, a11y wiring, and `data-slot` attributes.
- Upstream source of truth: `https://ui.shadcn.com/r/styles/new-york-v4/<name>.json`. Never modify `~/code/lscaturchio.xyz`.
- Branch `identity-registry`; commit per task; `bun run registry:build` before any commit that changed sources or `registry.json` (CI drift check).

**Approved deviations recorded here:**
1. Transitive non-catalog deps (e.g. `use-mobile`) are imported as their own registry items; the exact-name test reads the checked-in manifest `registry-manifest.json` instead of hard-coding 70 (spec said "pins 70"; the manifest pins the exact set, which is ≥70 with the closure).
2. Sidebar's upstream `cssVars` are merged into `identity.css` re-expressed with identity tokens, not upstream slate values.

---

### Task 1: Restructure to consumer-shaped paths

**Files:**
- Move: `registry/ui/*.tsx` → `components/ui/*.tsx`; `registry/patterns/*.tsx|ts` → `components/patterns/*` (`navigation-path.ts` stays in patterns, `lib/navigation-path.ts` re-export unchanged)
- Modify: `registry.json` (paths), `app/page.tsx`, `app/patterns/page.tsx` (imports), `tests/registry.test.ts` (drop the "no cross-registry import" test — Task 3 replaces it), `tests/navigation-path.test.ts` (import path)
- Keep: `registry/theme/*` as is.

**Interfaces:**
- Produces: all component imports as `@/components/ui/<name>` / `@/components/patterns/<name>`; `registry.json` file paths `components/...`.

- [ ] **Step 1: Move files**

```bash
mkdir -p components
git mv registry/ui components/ui
git mv registry/patterns components/patterns
```

- [ ] **Step 2: Rewrite imports and registry paths**

```bash
# App pages + lib re-export + tests
grep -rl "@/registry/ui\|@/registry/patterns\|registry/ui/\|registry/patterns/" app lib tests registry.json | while read f; do
  sed -i '' -e 's|@/registry/ui/|@/components/ui/|g' \
            -e 's|@/registry/patterns/|@/components/patterns/|g' \
            -e 's|registry/ui/|components/ui/|g' \
            -e 's|registry/patterns/|components/patterns/|g' "$f"
done
grep -rn "registry/ui\|registry/patterns" app lib tests registry.json components && echo LEFTOVERS || echo clean
```

In `tests/registry.test.ts`, delete the entire `test("no item imports another registry component", ...)` block (Task 3 replaces it with the dependency-consistency test).

- [ ] **Step 3: Rebuild, test, verify**

Run: `bun run registry:build && bun test && bun run build`
Expected: all pass; routes `/` and `/patterns` build.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: consumer-shaped source paths (components/ui, components/patterns)"
```

---

### Task 2: Importer — vendor the upstream catalog and regenerate registry.json

**Files:**
- Create: `scripts/import-upstream.ts`, `registry-manifest.json` (generated), `components/ui/<57 upstream files>` (generated), `hooks/*` (generated, e.g. `use-mobile.ts`)
- Modify: `registry.json` (append generated items), `package.json` (new deps), `app/globals.css` (tw-animate-css), `registry/theme/identity.css` (sidebar vars), `README.md` is Task 11.

**Interfaces:**
- Consumes: Task 1 layout.
- Produces: `registry-manifest.json` — `{ "items": ["accordion", ...all item names...], "imported": ["alert", ...] }` used by tests; vendored sources; `registry.json` entries with `files[].path` under `components/ui/` or `hooks/`, URL registryDependencies.

- [ ] **Step 1: Write `scripts/import-upstream.ts`** (full content)

```ts
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
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const BASE = "https://ui.shadcn.com/r/styles/new-york-v4";
const OUR_URL = "https://ui.lscaturchio.xyz/r";

/** Items we own; never imported, and cross-refs to them resolve to OUR registry. */
const OURS = new Set([
  "theme", "button", "card", "badge", "accordion", "avatar", "section",
  "theme-toggle", "reveal", "active-nav-link", "breadcrumb-nav",
  "scroll-to-top", "skeleton",
]);

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
const queue = [...toImport];
while (queue.length) {
  const name = queue.shift()!;
  if (fetched.has(name) || OURS.has(name) || name === "utils") continue;
  const res = await fetch(`${BASE}/${name}.json`);
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
    mkdirSync(join(abs, ".."), { recursive: true });
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
  for (const dep of item.registryDependencies ?? []) {
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
    },
    null,
    2,
  ) + "\n",
);

console.log(`imported ${fetched.size} items; registry now has ${registry.items.length}`);
console.log("npm deps needed:\n  bun add " + [...npmDeps].sort().join(" "));
if (Object.keys(cssVarsCollected).length) {
  console.log("cssVars to merge into identity.css:", JSON.stringify(cssVarsCollected, null, 2));
}
```

- [ ] **Step 2: Run it and install dependencies**

Run: `bun scripts/import-upstream.ts`
Expected: `imported 57+ items` (closure may add hooks like `use-mobile`), a printed `bun add ...` line, and cssVars output (sidebar, possibly chart).
Then run the printed `bun add ...` command, plus: `bun add tw-animate-css`.

- [ ] **Step 3: Wire tw-animate-css and sidebar vars**

`app/globals.css` — add after the tailwindcss import:
```css
@import 'tw-animate-css';
```

`registry/theme/identity.css` — append at the end (identity-toned sidebar vars; adjust only if the importer printed different variable *names*):
```css
/* Sidebar tokens (consumed by the sidebar component) — identity paper/green. */
@theme {
  --color-sidebar: hsl(var(--sidebar));
  --color-sidebar-foreground: hsl(var(--sidebar-foreground));
  --color-sidebar-primary: hsl(var(--sidebar-primary));
  --color-sidebar-primary-foreground: hsl(var(--sidebar-primary-foreground));
  --color-sidebar-accent: hsl(var(--sidebar-accent));
  --color-sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground));
  --color-sidebar-border: hsl(var(--sidebar-border));
  --color-sidebar-ring: hsl(var(--sidebar-ring));
}

@layer base {
  :root {
    --sidebar: 38 25% 95%;
    --sidebar-foreground: 210 15% 12%;
    --sidebar-primary: var(--primary);
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 32 50% 92%;
    --sidebar-accent-foreground: 215 15% 16%;
    --sidebar-border: 30 18% 86%;
    --sidebar-ring: var(--primary);
  }
  .dark {
    --sidebar: 220 15% 10%;
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: var(--primary);
    --sidebar-primary-foreground: 220 15% 8%;
    --sidebar-accent: 210 16% 16%;
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 220 10% 18%;
    --sidebar-ring: var(--primary);
  }
}
```

Update the `theme` item in `registry.json`: add `"dependencies": ["tw-animate-css"]`.

- [ ] **Step 4: Sanity compile (no gallery demos yet)**

Run: `bunx tsc --noEmit 2>&1 | head -30`
Vendored files may reference each other; fix ONLY mechanical issues (missing hook targets, import rewrites the regex missed). Do not restyle yet. `bun run build` is NOT expected to cover these files yet (nothing imports them).

- [ ] **Step 5: Rebuild registry and commit the pre-restyle snapshot**

Run: `bun run registry:build`
```bash
git add -A && git commit -m "feat: vendor upstream shadcn catalog (pre-restyle snapshot)"
```
(Separate commit on purpose: restyle diffs stay reviewable against upstream.)

---

### Task 3: Validation tests for the expanded registry

**Files:**
- Modify: `tests/registry.test.ts` (replace name-set test; add manifest + dependency-consistency tests)

**Interfaces:**
- Consumes: `registry-manifest.json` from Task 2.

- [ ] **Step 1: Replace the expected-items test and add new tests**

In `tests/registry.test.ts`, replace the `test("expected items are present", ...)` block with:

```ts
  const manifest = JSON.parse(readFileSync(join(ROOT, "registry-manifest.json"), "utf8"));

  test("registry matches the checked-in manifest exactly", () => {
    const names = registry.items.map((i: { name: string }) => i.name).sort();
    expect(names).toEqual(manifest.items);
    expect(names.length).toBeGreaterThanOrEqual(70);
  });

  test("collision names are ours (paths under components/, not vendored twice)", () => {
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
          if (ownFiles.has(dep)) continue; // same-item file
          expect(
            declared.has(dep),
            `${item.name}: ${file.path} imports ${dep} without registryDependencies entry`,
          ).toBe(true);
        }
      }
    }
  });
```

- [ ] **Step 2: Run and iterate to green**

Run: `bun test tests/registry.test.ts`
Failures reveal importer gaps (undeclared regDeps upstream relies on implicitly, e.g. a component importing a sibling without declaring it). Fix by adding the missing `registryDependencies` URL to that item in `scripts/import-upstream.ts` (an `EXTRA_DEPS: Record<string,string[]>` map applied when generating items), re-run the importer, re-run tests until green. Also re-run `bun run registry:build`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "test: manifest-driven registry validation with dependency-consistency check"
```

---

### Tasks 4–10: Per-category restyle + gallery page

Shared setup (do once, in Task 4): create `components/gallery/demo-block.tsx`:

```tsx
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
```

and `app/components/page.tsx` (category index):

```tsx
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";

const CATEGORIES = [
  { href: "/components/forms", label: "Forms & inputs" },
  { href: "/components/overlays", label: "Overlays" },
  { href: "/components/navigation", label: "Navigation" },
  { href: "/components/data", label: "Data display" },
  { href: "/components/feedback", label: "Feedback" },
  { href: "/components/layout", label: "Layout" },
  { href: "/components/chat", label: "AI chat" },
] as const;

export default function ComponentsIndex() {
  return (
    <main>
      <Section padding="compact">
        <SectionHeader index="05" eyebrow="REGISTRY" title="Components"
          description="The full catalog, restyled to the identity. Every item: npx shadcn add https://ui.lscaturchio.xyz/r/<name>.json" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.href} href={c.href} className="surface-card rounded-2xl card-padding-sm block">
              <span className="text-card-title">{c.label}</span>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
```

Also in Task 4: add a `Components` link next to `Patterns` on the home hero (`app/page.tsx`): `<a className="cta-secondary rounded-xl px-6 py-3" href="/components">Components</a>`.

**Every category task follows the same 4 steps:**
1. Restyle that category's vendored files per the Global Constraints checklist (edit `components/ui/<name>.tsx` directly; keep diffs minimal).
2. Write the category page demoing every component in the category, each inside a `DemoBlock` (client components where interactivity requires: add `"use client"` to the *page* or use a colocated `demos.tsx` client file).
3. Verify: `bun test && bun run build` — the page compiles every component in the category. Fix compile/restyle fallout.
4. Commit: `git add -A && git commit -m "feat(catalog): <category> — restyle + gallery"`.

### Task 4: Forms & inputs (`app/components/forms/page.tsx`)

Components: button-group, checkbox, combobox, field, form, input, input-group, input-otp, label, native-select, radio-group, select, slider, switch, textarea, toggle, toggle-group, calendar.
Restyle notes: inputs get `surface-input` semantics (border, focus ring already via `ring-ring`); `rounded-xl` on input/select/textarea triggers; calendar weekday header row → `label-mono`; selected day = `bg-primary text-primary-foreground`.
Demo specifics — interactive pieces live in `app/components/forms/demos.tsx` (`"use client"`); representative snippets:

```tsx
<DemoBlock label="INPUT + LABEL"><div className="grid max-w-sm gap-2"><Label htmlFor="e">Email</Label><Input id="e" placeholder="you@example.com" /></div></DemoBlock>
<DemoBlock label="SELECT"><Select><SelectTrigger className="w-48"><SelectValue placeholder="Pick a fruit" /></SelectTrigger><SelectContent><SelectItem value="a">Apple</SelectItem><SelectItem value="b">Banana</SelectItem></SelectContent></Select></DemoBlock>
<DemoBlock label="CALENDAR"><Calendar mode="single" /></DemoBlock>
<DemoBlock label="COMBOBOX">{/* upstream combobox anatomy with 3 fruit options */}</DemoBlock>
```
…and one `DemoBlock` per remaining component (checkbox with label, radio-group of 3, slider defaultValue, switch, textarea, toggle, toggle-group multiple, input-otp 6 slots, button-group of 3 buttons, input-group with prefix, native-select, field + form: use upstream's documented minimal example — form uses react-hook-form + zod as upstream declares).

### Task 5: Overlays (`app/components/overlays/page.tsx`)

Components: alert-dialog, command, context-menu, dialog, drawer, dropdown-menu, hover-card, menubar, popover, sheet, tooltip, toast, sonner.
Restyle notes: floating panels `rounded-2xl` + hairline border, no `shadow-lg` (at most `shadow-sm`); dialog/sheet/drawer content → `glass-heavy`; command shortcuts + menu shortcut hints → `label-mono`.
Mount `<Toaster />` (sonner) once on this page; toast demo buttons trigger both `toast` (base-ui toast) and `sonner`. Every overlay demo = trigger button (`Button variant="outline"`) + minimal content. Context-menu demo = right-click zone `surface-recessed rounded-2xl p-8`.

### Task 6: Navigation (`app/components/navigation/page.tsx`)

Components: breadcrumb, navigation-menu, pagination, sidebar, tabs, direction.
Restyle notes: active tab/page indicators use primary tint; breadcrumb current page `font-medium text-foreground`; pagination status text `label-mono`.
Sidebar demo: self-contained block —

```tsx
<DemoBlock label="SIDEBAR">
  <SidebarProvider className="min-h-[320px] rounded-2xl border overflow-hidden">
    <Sidebar collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Catalogue</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {["Colors", "Typography", "Components"].map((t) => (
                <SidebarMenuItem key={t}><SidebarMenuButton>{t}</SidebarMenuButton></SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <main className="flex-1 p-6 text-description">Content beside the sidebar.</main>
  </SidebarProvider>
</DemoBlock>
```

### Task 7: Data display (`app/components/data/page.tsx`)

Components: aspect-ratio, carousel, chart, item, kbd, marker, table, empty.
Restyle notes: table `<th>` → `label-mono`; kbd → `label-mono` on `surface-recessed rounded-md px-1.5`; chart palette from identity tokens.
Chart demo (recharts via upstream chart wrapper):

```tsx
const chartData = [
  { month: "Jan", views: 186 }, { month: "Feb", views: 305 }, { month: "Mar", views: 237 },
  { month: "Apr", views: 273 }, { month: "May", views: 209 }, { month: "Jun", views: 214 },
];
const chartConfig = { views: { label: "Views", color: "hsl(var(--primary))" } } satisfies ChartConfig;
<ChartContainer config={chartConfig} className="h-56 w-full">
  <BarChart data={chartData}><CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="views" fill="var(--color-views)" radius={6} /></BarChart>
</ChartContainer>
```
Table demo: 3-row invoice table with caption `label-mono`. Carousel: 3 `surface-card` slides. Empty: icon + title + description + CTA per upstream anatomy.

### Task 8: Feedback (`app/components/feedback/page.tsx`)

Components: alert, progress, spinner (+ demo of our existing `skeleton` for completeness — no new item).
Restyle notes: alert variants map to status tokens (`success`/`warning`/`info`/`destructive` muted backgrounds + matching foreground); progress track `bg-muted`, indicator `bg-primary`.

### Task 9: Layout (`app/components/layout/page.tsx`)

Components: collapsible, resizable, scroll-area, separator.
Restyle notes: resizable handle hairline `bg-border` with primary tint on hover/drag; separator is a `gallery-rule` sibling — keep upstream API, color `bg-border`.

### Task 10: AI chat (`app/components/chat/page.tsx`)

Components: attachment, bubble, message, message-scroller, questionnaire.
Restyle notes: bubbles — user `bg-primary text-primary-foreground`, assistant `surface`; both `rounded-2xl`; metadata rows `label-mono`. Demos render static conversations (2 messages, one attachment chip, a 2-question questionnaire) — no chat backend; if a component requires a `@shadcn/react` provider, wrap the demo in the minimal provider from its README (fetch `https://ui.shadcn.com/r/styles/new-york-v4/<name>.json` description/docs if needed).

---

### Task 11: Docs, deep smoke, full verification

**Files:**
- Modify: `README.md` (items table), `scripts/smoke-registry.ts`, `scripts/smoke-fixture/app/deep/page.tsx` (create)

- [ ] **Step 1: Extend the smoke test with a deep-dependency case**

`scripts/smoke-fixture/app/deep/page.tsx`:
```tsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export default function Deep() {
  return (
    <main className="p-8">
      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Open</Button></PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search…" />
            <CommandList><CommandItem>One</CommandItem><CommandItem>Two</CommandItem></CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </main>
  );
}
```

In `scripts/smoke-registry.ts`, extend the `shadcn add` line and expectations:
```ts
  await $`bunx --bun shadcn@latest add ${base}/theme.json ${base}/button.json ${base}/reveal.json ${base}/combobox.json --yes --overwrite`.cwd(work);
```
and add to `expected`: `"components/ui/combobox.tsx"`, `"components/ui/popover.tsx"`, `"components/ui/command.tsx"`.
IMPORTANT: the combobox chain's registryDependencies point at `https://ui.lscaturchio.xyz/r/...` — the smoke consumer must resolve them from the LOCAL server instead. Make the importer's OUR_URL configurable: `const OUR_URL = process.env.REGISTRY_BASE_URL ?? "https://ui.lscaturchio.xyz/r";` is NOT enough (URLs are baked into committed registry.json). Instead the smoke script rewrites baked URLs on the fly: serve `public/` through a tiny transform — in the smoke server's fetch handler, for `.json` files, replace `https://ui.lscaturchio.xyz/r` with `http://localhost:${PORT}/r` in the body before responding. (3-line change; live URLs stay canonical in the committed output.)

- [ ] **Step 2: Update README items table**

Replace the Items table rows with the category table from the spec (7 rows, one per category, listing item names), keep theme/patterns rows.

- [ ] **Step 3: Full verification**

Run: `bun run registry:build && bun test && bun run build && bun run smoke`
Expected: all green, smoke shows the combobox chain landing.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: deep-dependency smoke, README catalog table"
```

---

### Task 12: Ship

- [ ] **Step 1: Push and watch CI**

```bash
git push
```
Monitor PR #1 checks until green (Monitor tool, poll `gh pr checks 1 --json name,bucket` every 60s, emit on non-pending).

- [ ] **Step 2: Deploy production**

```bash
vercel --prod
```

- [ ] **Step 3: Live verification**

From a scratch dir in the session scratchpad: copy `scripts/smoke-fixture`, `bun install`, then
```bash
bunx --bun shadcn@latest add https://ui.lscaturchio.xyz/r/theme.json https://ui.lscaturchio.xyz/r/combobox.json --yes --overwrite
```
Assert `components/ui/combobox.tsx`, `components/ui/popover.tsx`, `components/ui/command.tsx`, `components/ui/button.tsx` exist and `bun run build` passes. Report PR + live URLs.

---

## Self-review notes

- Spec coverage: consumer-shaped restructure (T1), vendoring + closure + cssVars + tw-animate-css (T2), manifest/count/dependency tests (T3), restyle checklist + all 7 category pages incl. sonner Toaster + sidebar demo (T4–10), deep smoke + README (T11), CI/deploy/live-verify (T12). Collision policy enforced by importer OURS set + T3 test.
- Known risk, handled: upstream sources may not compile in our stack until their category task runs (T2 Step 4 keeps that bounded to mechanical fixes; category tasks own real fixes). Smoke URL-rebaking handled in T11 Step 1. Manifest replaces the hard-coded 70 (recorded deviation).
- Type consistency: `DemoBlock({label, children})` used across T4–T10; `registry-manifest.json` shape `{items, imported}` matches T3's reader; importer `OUR_URL` matches the test's URL-suffix parsing.

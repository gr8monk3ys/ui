# Full shadcn Catalog Expansion — Design

**Date:** 2026-08-08
**Repo:** `~/code/ui` (gr8monk3ys/ui)
**Status:** Approved
**Builds on:** `2026-08-07-ui-identity-registry-design.md`

## Purpose

Expand the identity registry from 13 items to the full current shadcn/ui
catalog (63 UI items as of 2026-08-08), each restyled to the lscaturchio
identity, registered, demonstrated in the gallery, and consumable from
`https://ui.lscaturchio.xyz/r/<item>.json`.

## Decisions

| Question | Decision |
|---|---|
| Catalog scope | The full 63, including the AI-chat family (attachment, bubble, message, message-scroller, questionnaire) |
| Sourcing | Vendor upstream sources via `shadcn add` from the official registry, then apply the identity restyle pass |
| Collisions | Ours win: existing identity items keep their names; upstream versions of button/card/badge/accordion/avatar/skeleton are not imported. Upstream composable `breadcrumb` ships alongside our `breadcrumb-nav`. |
| Cross-item imports | Allowed, as consumer-shaped paths (`@/components/ui/x`), backed by `registryDependencies` URLs into our own registry |

Net-new items: 57 (63 upstream − 6 name collisions kept ours: accordion,
avatar, badge, button, card, skeleton). Total registry: 70 items.

## Architecture changes

### Consumer-shaped source layout

Registry component sources move so that in-repo paths equal consumer paths:

```
components/ui/*        (was registry/ui/*)        — all catalog components
components/patterns/*  (was registry/patterns/*)  — reveal, active-nav-link, breadcrumb-nav, scroll-to-top
registry/theme/*       (unchanged)                — identity.css, fonts.ts
lib/*                  (unchanged)                — utils.ts, navigation-path.ts
```

Cross-item imports are literal consumer paths (`@/components/ui/popover`),
resolvable identically in this repo (tsconfig `@/*` → root) and in any
consumer after `shadcn add`. No import transformation, no re-export stubs.
`registry.json` file paths update to match. Gallery pages import from
`@/components/...`.

### Dependency discipline (replaces "no cross-item imports")

Validation test: for every `@/components/ui/<x>`, `@/components/patterns/<x>`,
or `@/lib/<x>` import inside a registry item's files, the item must declare a
matching entry —

- `@/components/...` import → `registryDependencies` contains
  `https://ui.lscaturchio.xyz/r/<x>.json` (our registry, never a bare name
  that would resolve to upstream — except `utils`, which stays the canonical
  shadcn `utils` for `cn`)
- `@/lib/navigation-path` → the item ships the file or depends on the item
  that does (`active-nav-link`)

npm dependencies declared per item as upstream does (recharts, embla-carousel-react,
react-day-picker + date-fns, cmdk, `@base-ui/react`, `@shadcn/react`, sonner,
input-otp, react-resizable-panels, next-themes, …).

### Motion dependency

Upstream components animate via `tw-animate-css` utility classes
(`animate-in`, `fade-in-0`, `zoom-in-95`, …). `tw-animate-css` becomes:
- an npm dependency of this repo, imported in `app/globals.css`;
- a declared `dependencies` entry of the `theme` registry item, with the
  README documenting the consumer-side `@import "tw-animate-css";` line.

All identity motion continues to respect `prefers-reduced-motion` (
tw-animate-css utilities honor it via Tailwind's motion-safe conventions;
our own utilities keep their explicit guards).

## Identity restyle pass

A written checklist applied to every incoming component (kept in the spec as
the definition of "restyled"; applied with minimal diffs from upstream so
future syncs stay cheap):

1. **Surfaces:** solid shadow blooms → flat identity surfaces. Cards/panels:
   `surface`/`surface-card`. Floating layers (popover, dropdown, menubar,
   context-menu, hover-card, select, combobox, command, tooltip): hairline
   border + `bg-popover`; large floating layers (dialog, sheet, drawer) may
   use `glass-heavy`. Remove `shadow-md`/`shadow-lg` in favor of
   `shadow-sm`-or-none + border.
2. **Radii:** interactive elements `rounded-xl`, container/floating layers
   `rounded-2xl` (matching existing button/card), small inline elements
   (badge, kbd, checkbox) keep upstream sizing where identity has no rule.
3. **Wall labels:** micro-metadata becomes `label-mono` — table `<th>`,
   command shortcuts/kbd, calendar weekday header, pagination status,
   breadcrumb current-page eyebrow contexts where upstream uses
   `text-xs text-muted-foreground uppercase`-ish styling.
4. **Focus & selection:** `focus-visible` rings use `ring-ring` (already
   primary-green via `--ring: var(--primary)`); selected/active states tint
   with `hsl(var(--primary)/0.06–0.12)` like `surface-button` hover, not
   `bg-accent` grey — except where upstream semantics need `bg-accent`
   (menus may keep accent hover; accent is identity warm-tint already).
5. **Tokens only:** no hard-coded colors; anything upstream hard-codes gets
   mapped to theme tokens.
6. **Minimal diff:** structural JSX, a11y wiring, and data-slot attributes
   from upstream are preserved untouched.

## Gallery

New `/components` section, seven category pages, each demoing its components
in wall-label-annotated blocks (same register as existing pages):

| Route | Category | Components |
|---|---|---|
| `/components/forms` | Forms & inputs | button-group, checkbox, combobox, field, form, input, input-group, input-otp, label, native-select, radio-group, select, slider, switch, textarea, toggle, toggle-group, calendar |
| `/components/overlays` | Overlays | alert-dialog, command, context-menu, dialog, drawer, dropdown-menu, hover-card, menubar, popover, sheet, tooltip, toast, sonner |
| `/components/navigation` | Navigation | breadcrumb, navigation-menu, pagination, sidebar, tabs, direction |
| `/components/data` | Data display | aspect-ratio, carousel, chart, item, kbd, marker, table, empty |
| `/components/feedback` | Feedback | alert, progress, spinner, skeleton-demo (existing item) |
| `/components/layout` | Layout | collapsible, resizable, scroll-area, separator |
| `/components/chat` | AI chat | attachment, bubble, message, message-scroller, questionnaire |

`/components` is an index page linking the categories; home page links to it.
Existing home/patterns pages unchanged (aside from the nav link). Demos are
minimal but interactive (dialogs open, comboboxes filter, charts render with
placeholder data).

## Verification

1. **Tests (bun test):** registry item count and name set (all 70), declared
   files exist, built `public/r/*.json` exists per item, import↔dependency
   consistency check (section above).
2. **Build:** `bun run build` compiles every component through the gallery
   pages — the gallery is the compile-coverage harness.
3. **Smoke:** existing scratch-consumer smoke extended with a deep-dependency
   case: `shadcn add` of `combobox` (chain: popover, command, button, utils)
   from the served registry; assert files land and consumer builds.
4. **CI:** unchanged pipeline covers all of the above; drift check still
   fails if sources change without `registry:build`.

## Error handling

- Items with `@base-ui/react` / `@shadcn/react` runtimes are vendored as
  upstream ships them; if an item fails to compile in our stack, it blocks
  the task until fixed (no silent exclusions — the item-count test pins 70).
- `sonner` requires a `<Toaster>` mount; gallery mounts it on the overlays
  page; README documents the consumer requirement.
- `sidebar` requires its provider/css-var setup; the navigation page mounts
  a self-contained demo; README notes it.

## Out of scope

- Restyling beyond the checklist (no redesign of upstream component APIs).
- Auto-syncing with future upstream shadcn releases.
- Blocks/templates (shadcn "blocks" are not part of this expansion).

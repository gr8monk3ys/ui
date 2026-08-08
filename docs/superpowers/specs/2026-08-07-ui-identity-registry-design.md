# UI Identity Registry — Design

**Date:** 2026-08-07
**Repo:** `~/code/ui` (gr8monk3ys/ui)
**Status:** Approved

## Purpose

Capture the visual identity of lscaturchio.xyz — warm paper, forest-green
primary, Fraunces/Instrument Sans/IBM Plex Mono, monospace "wall-label"
metadata, hairline dividers, restrained motion — as a reusable kit that gives
current and future applications a shared identity.

## Decisions (settled during brainstorming)

| Question | Decision |
|---|---|
| Consumers | Next.js/React + Tailwind v4 apps only |
| Scope | Full kit: theme + styled components + signature patterns |
| Theming | One fixed identity; per-app knobs limited to `--primary` and `--radius` |
| Preview | Demo/gallery Next.js app lives in this repo |
| Distribution | shadcn-style registry; apps pull with `npx shadcn add <url>/r/<item>` |

npm packaging was rejected (publishing overhead, version-bump churn across
~72 repos); plain template folder was rejected (no granularity, uncontrolled
drift). The registry gives copy-in ownership with structure.

## Architecture

One Next.js app that is both the gallery and the registry host:

```
ui/
├── registry/                  # source of truth for everything distributable
│   ├── theme/
│   │   ├── globals.css        # tokens + gallery-language utilities
│   │   └── fonts.ts           # Fraunces / Instrument Sans / IBM Plex Mono (next/font)
│   ├── ui/                    # styled primitives
│   ├── patterns/              # signature interactive pieces
│   └── lib/utils.ts           # cn() helper
├── registry.json              # shadcn registry manifest
├── app/                       # demo/gallery app; serves built /r/*.json
└── README.md                  # consumption guide + identity rules
```

- Package manager: **Bun** (fleet TS default).
- `shadcn build` compiles `registry.json` into static `/r/<item>.json` served
  by the demo app's Vercel deployment.
- Consumers: `npx shadcn add https://<deployment>/r/theme` (or any item);
  files are copied into the consuming app with dependency resolution.

## Extraction inventory

Source: `~/code/lscaturchio.xyz`, primarily `src/app/globals.css` (the
identity is concentrated there) plus selected `src/components/ui/*`.

### Theme (`registry/theme/globals.css`)

Extracted and cleaned of site-specific cruft (Google Translate hardening,
site-specific rails like `selected-writing-*`):

- **Color tokens** — warm-paper light (`--background: 38 25% 97%`), slate-night
  dark, forest-green primary (`152 52% 20%` light / `152 44% 46%` dark),
  status colors (success/warning/info + muted variants).
- **Typography scale** — fluid `text-display`, `text-page-title`,
  `text-section-title`, `text-card-title`, `text-subsection`, body/description
  /label variants; Fraunces on headings with tight tracking.
- **Gallery language** — `label-mono` wall labels, `gallery-rule` hairlines,
  drop-cap prose styling, green `::selection`, paper-grain `body::after`
  noise overlay.
- **Surfaces** — the flat editorial set, **renamed from `neu-*` to
  `surface-*`** (`surface`, `surface-sm`, `surface-lg`, `surface-recessed`,
  `surface-button`, `surface-card`, `surface-input`); nothing in this repo
  depends on the legacy names. Also `cta-primary`, `cta-secondary`,
  `cta-link`, `glass`/`glass-subtle`/`glass-heavy`. Legacy `--neu-shadow-*`
  variables are dropped (unused by the flat language).
- **Motion** — `reveal` primitives + keyframes, `nav-underline`,
  `skeleton-shimmer`, duration tokens, z-index scale. Every motion utility
  carries `prefers-reduced-motion` guards.
- **Layout** — `section-padding`, `card-padding`, `content-narrow/medium/wide`,
  `focus-ring`. The Tailwind v4 spacing-token trap is documented in a comment
  (do not define `--spacing-*` tokens; they shadow `max-w-*` utilities).

### Fonts (`registry/theme/fonts.ts`)

`next/font/google`: Fraunces (`--site-font-display`), Instrument Sans
(`--site-font-body`), IBM Plex Mono (`--site-font-mono`), matching the
variable names `globals.css` expects.

### Components (`registry/ui/`)

button, card, badge, accordion, avatar, Section, section-heading,
theme-toggle. Restyled shadcn primitives — Radix + CVA, dependencies declared
per registry item.

**Not carried** (embed lscaturchio content or are app-specific):
navbar, footer-section, contact-cta, resume-download-button, error-page,
structured-data, command-palette, work-timeline, pricing-tab,
message-loading. Can be added later if an app needs them.

### Patterns (`registry/patterns/`)

- `Reveal` — IntersectionObserver scroll reveal (pairs with the `reveal` utility)
- `ActiveNavLink` — nav link with slide-in underline
- `BreadcrumbNav`
- `ScrollToTop`
- `Skeleton` — shimmer loading block

## Accent knobs

The theme ships forest-green defaults. A consuming app may override exactly
two variables in its own `:root` **after** the theme import:

```css
:root {
  --primary: 262 60% 35%;   /* app's accent hue */
  --radius: 0.5rem;         /* corner personality */
}
```

(`--ring` follows `--primary`; the override snippet in the README covers both.)
Everything else — paper, typography, gallery language, motion — is the
identity and is not a knob. The README states this rule explicitly.

## Verification

1. **Visual** — the gallery app renders every token swatch, type-scale step,
   component state (default/hover/disabled/dark), and pattern. `bun dev` +
   look; deployed to Vercel so registry URLs are live.
2. **CI** — `bun run build` + `shadcn build` on every PR proves the app
   compiles and the registry manifest is valid. Repo is public → unlimited
   GitHub Actions minutes.
3. **End-to-end smoke** — script scaffolds a scratch Next.js consumer, runs
   `npx shadcn add` against the locally built registry output, and asserts
   the files land and the consumer builds. Every change has a way to prove
   itself.

## Error handling

- Registry items declare their dependencies (`registryDependencies`, npm
  `dependencies`) so `shadcn add` fails loudly rather than copying broken code.
- The smoke test is the guard against manifest/file drift.
- `prefers-reduced-motion` fallbacks are part of the definition of done for
  every motion pattern.

## Out of scope

- Non-React/non-Tailwind consumers.
- A theming engine or multiple themes.
- Auto-propagating updates to consumers (re-running `shadcn add` is the
  update path, by hand or by an orchestrator loop later).
- Porting app-specific components listed under "Not carried."

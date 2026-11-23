# ui

A personal shadcn registry: one visual identity plus the components built on it, published as installable JSON so separate apps stop drifting apart visually.

## Language

**Registry**:
The published set of installable items served at `https://ui.lscaturchio.xyz/r/<item>.json`.
_Avoid_: Component library, package

**Registry item**:
One installable unit in the Registry, named in `registry.json` (a component, pattern, hook, or the Theme).
_Avoid_: Component (when the unit may also be a Pattern, hook, or the Theme)

**Manifest**:
The checked-in list of exact Registry item names (`registry-manifest.json`) the Registry must match.
_Avoid_: Lockfile

**Collision name**:
A Registry item name that shadcn's own registry also uses (`button`, `card`, `badge`, `accordion`, `avatar`, `skeleton`), so ours must exist exactly once.

## Identity

**Theme**:
The Registry item (`identity.css` plus `fonts.ts`) that fixes the paper, typography, and motion every app shares.
_Avoid_: Skin, design tokens

**Knob**:
One of the only two values an app may set after importing the Theme: `--primary` and `--radius`.
_Avoid_: Override, customization

**Display face**:
Lorenzo Hand, the author's handwriting, used for headings; a binary the Registry cannot ship.
_Avoid_: Heading font

**Wall label**:
A small uppercase monospace caption in the gallery language.
_Avoid_: Eyebrow, overline

**Identity primitive**:
A component that carries the identity itself rather than mirroring upstream shadcn (`button`, `card`, `badge`, `accordion`, `avatar`, `section`, `theme-toggle`, `skeleton`).

## Catalogue

**Pattern**:
A Registry item that is behaviour or foundation rather than a visual component (`reveal`, `active-nav-link`, `scroll-to-top`, `theme`, `theme-toggle`, `use-mobile`).

**Catalog**:
The list that files every Registry item under exactly one Category or the Patterns set.
_Avoid_: Index

**Category**:
A named group of Registry items shown together in the Gallery (Forms & inputs, Overlays, Navigation, Data display, Feedback, Layout, AI chat).

**Gallery**:
The Next.js site that shows every Registry item, its Category, and its Install command.
_Avoid_: Storybook, docs site

**Install command**:
The `npx shadcn add` line that pulls one Registry item from the published Registry.

**Smoke consumer**:
A throwaway app (`scripts/smoke-fixture`) that installs items from the served Registry and must build.

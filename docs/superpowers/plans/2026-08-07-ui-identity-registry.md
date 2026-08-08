# UI Identity Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `~/code/ui` into a shadcn-style registry + gallery app that captures the lscaturchio.xyz visual identity for reuse across apps.

**Architecture:** One Next.js 16 app. Distributable sources live under `registry/` and are described by `registry.json`; `shadcn build` compiles them to static `public/r/*.json` that the deployed app serves. The app's own pages are the gallery that renders every token/component/pattern (dogfooding the registry sources directly via tsconfig path aliases).

**Tech Stack:** Bun, Next.js 16, React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), next-themes, Radix (accordion/avatar/slot), CVA, lucide-react, shadcn CLI v3, `bun test`.

## Global Constraints

- Package manager is **Bun**. Never use npm/yarn/pnpm commands in this repo.
- Tailwind **v4 CSS-first** config: no `tailwind.config.ts`; tokens via `@theme`, utilities via `@utility` in CSS.
- **Never define `--spacing-*` tokens in `@theme`** — they generate spacing-suffixed utilities that shadow `max-w-2xl` etc. (documented trap from the source site).
- Class rename map (source → here), applied to every extracted file: `neu-flat`→`surface`, `neu-flat-sm`→`surface-sm`, `neu-flat-lg`→`surface-lg`, `neu-pressed`→`surface-recessed`, `neu-pressed-sm`→`surface-recessed`, `neu-button`→`surface-button`, `neu-card`→`surface-card`, `neu-input`→`surface-input`. Legacy `--neu-shadow-*` variables are **not** carried.
- Per-app knobs are exactly `--primary` and `--radius`. `--ring` must be defined as `var(--primary)` so it follows the knob. Nothing else is overridable.
- Every motion utility/pattern keeps its `prefers-reduced-motion` guard.
- Registry items must not import each other (except the implicit shadcn `utils` registryDependency for `cn`). Source imports use `@/lib/utils` and `@/lib/navigation-path` only.
- Source of extraction: `/Users/natalyscaturchio/code/lscaturchio.xyz` (read-only; never modify that repo).
- All work on branch `identity-registry`; commits after every task; nothing pushed to `main`.

**Approved deviations from spec (simplifications, recorded here):**
1. `section-heading` registry item = the `SectionHeader` export from `Section.tsx` (museum wall-label header), not the site's framer-motion `section-heading.tsx`. Avoids a framer-motion dependency for a worse component. `section` and `section-heading` ship as one item named `section`.
2. No `registry/lib/utils.ts` item. Items declare `registryDependencies: ["utils"]` (shadcn's canonical `cn` — identical code). The repo keeps `lib/utils.ts` locally for the gallery.
3. `neu-pressed` and `neu-pressed-sm` were identical in the flat language; merged into one `surface-recessed`.

---

### Task 1: Scaffold the gallery app shell

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `next-env.d.ts` (generated), `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `lib/utils.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` from `lib/utils.ts`; tsconfig alias `@/*` → repo root; `bun run build` / `bun run dev` scripts.

- [ ] **Step 1: Write config files**

`package.json`:
```json
{
  "name": "ui",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "bun test",
    "registry:build": "shadcn build",
    "smoke": "bun scripts/smoke-registry.ts"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-slot": "^1.1.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.0.0",
    "lucide-react": "^0.577.0",
    "next": "^16.1.6",
    "next-themes": "^0.4.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.1",
    "@tailwindcss/typography": "^0.5.9",
    "@types/bun": "^1.2.0",
    "@types/node": "^25.5.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "shadcn": "^3.0.0",
    "tailwindcss": "^4.2.1",
    "typescript": "^5.7.0"
  }
}
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "scripts/smoke-fixture"]
}
```

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

`postcss.config.mjs`:
```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

`.gitignore`:
```
node_modules/
.next/
out/
next-env.d.ts
*.tsbuildinfo
.vercel
.DS_Store
```

- [ ] **Step 2: Write minimal app files**

`lib/utils.ts`:
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`app/globals.css` (placeholder; Task 2 replaces it):
```css
@import 'tailwindcss';
```

`app/layout.tsx` (placeholder; Task 2 replaces it):
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI — identity registry",
  description: "The lscaturchio identity as a reusable shadcn registry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx` (placeholder; Task 3 replaces it):
```tsx
export default function Home() {
  return <main className="p-8">gallery coming up</main>;
}
```

- [ ] **Step 3: Install and verify build**

Run: `bun install && bun run build`
Expected: `✓ Compiled successfully`, route `/` listed.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: scaffold gallery app shell (Next 16 + Tailwind v4 + Bun)"
```

---

### Task 2: Identity theme (CSS + fonts) wired into the gallery

**Files:**
- Create: `registry/theme/identity.css`, `registry/theme/fonts.ts`
- Modify: `app/globals.css`, `app/layout.tsx`
- Test: `tests/utils.test.ts`

**Interfaces:**
- Produces: `identity.css` (all tokens + utilities listed below); `fonts.ts` exporting `displayFont`, `bodyFont`, `monoFont`, and `fontVariables: string` (space-joined variable classes). Utility class names later tasks rely on: `label-mono`, `gallery-rule`, `surface`, `surface-sm`, `surface-lg`, `surface-recessed`, `surface-button`, `surface-card`, `surface-input`, `cta-primary`, `cta-secondary`, `cta-link`, `reveal`, `nav-underline`, `nav-underline-active`, `skeleton-shimmer`, `glass`, `glass-subtle`, `glass-heavy`, `text-display`, `text-page-title`, `text-section-title`, `text-card-title`, `text-subsection`, `text-body-lg`, `text-body`, `text-body-sm`, `text-description`, `text-description-sm`, `text-label`, `section-padding`, `section-padding-sm`, `card-padding`, `card-padding-sm`, `content-narrow`, `content-medium`, `content-wide`, `focus-ring`, `.prose-gallery` drop cap.

- [ ] **Step 1: Write failing test for cn**

`tests/utils.test.ts`:
```ts
import { describe, expect, test } from "bun:test";
import { cn } from "../lib/utils";

describe("cn", () => {
  test("merges conflicting tailwind classes, last wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  test("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
```

Run: `bun test` — Expected: PASS (utils exists from Task 1; this pins behavior).

- [ ] **Step 2: Write `registry/theme/fonts.ts`**

```ts
import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";

/** Fraunces — display serif for headings and drop caps. */
export const displayFont = Fraunces({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--site-font-display",
});

/** Instrument Sans — body text. */
export const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--site-font-body",
});

/** IBM Plex Mono — wall-label metadata, kickers, catalogue numbers. */
export const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
  variable: "--site-font-mono",
});

/** Put this on <html> (or <body>) className. */
export const fontVariables = `${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`;
```

- [ ] **Step 3: Write `registry/theme/identity.css`**

Full content (adapted from `lscaturchio.xyz/src/app/globals.css`: surface renames applied, `--neu-shadow-*`/`selected-writing-*`/Google-Translate rules/`font-system` dropped, radius scale derived from the `--radius` knob, `--ring` follows `--primary`):

```css
/* ============================================================
 * IDENTITY — warm paper, forest green, gallery language.
 * Consume: `@import "tailwindcss"; @import "./identity.css";`
 * Knobs: override ONLY --primary and --radius after the import.
 * Everything else (paper, type, gallery language) IS the identity.
 * The .prose-gallery drop cap assumes @tailwindcss/typography in
 * the consuming app if you use prose classes alongside it.
 * ============================================================ */

@custom-variant dark (&:is(.dark *));

@theme {
  --font-display:
    var(--site-font-display), ui-sans-serif, system-ui, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji';
  --font-body:
    var(--site-font-body), ui-sans-serif, system-ui, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji';
  --font-mono:
    var(--site-font-mono), ui-monospace, 'SFMono-Regular', 'Menlo', monospace;

  /* NOTE: do not define --spacing-xs/sm/md/lg/xl/2xl/... tokens here. In
   * Tailwind v4 they generate spacing-suffixed utilities (max-w-2xl, w-lg, …)
   * that shadow the standard container scale — a --spacing-2xl: 48px once
   * silently collapsed every `max-w-2xl` on the source site to 48px. */

  /* Radius scale derives from the --radius knob (default 0.75rem = 12px,
   * giving 6/8/10/14/18px — the source site's exact values). */
  --radius-sm: calc(var(--radius) - 6px);
  --radius-md: calc(var(--radius) - 4px);
  --radius-lg: calc(var(--radius) - 2px);
  --radius-xl: calc(var(--radius) + 2px);
  --radius-2xl: calc(var(--radius) + 6px);

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-success: hsl(var(--success));
  --color-success-foreground: hsl(var(--success-foreground));
  --color-success-muted: hsl(var(--success-muted));
  --color-warning: hsl(var(--warning));
  --color-warning-foreground: hsl(var(--warning-foreground));
  --color-warning-muted: hsl(var(--warning-muted));
  --color-info: hsl(var(--info));
  --color-info-foreground: hsl(var(--info-foreground));
  --color-info-muted: hsl(var(--info-muted));

  --transition-duration-fast: var(--duration-fast);
  --default-transition-duration: var(--duration-default);
  --transition-duration-slow: var(--duration-slow);

  --z-index-dropdown: var(--z-dropdown);
  --z-index-sticky: var(--z-sticky);
  --z-index-fixed: var(--z-fixed);
  --z-index-modal-backdrop: var(--z-modal-backdrop);
  --z-index-modal: var(--z-modal);
  --z-index-popover: var(--z-popover);
  --z-index-tooltip: var(--z-tooltip);
}

/* Tailwind v4 changed default border color to currentcolor; pin the v3
 * hairline default so extracted components render identically. */
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentcolor);
  }
}

/* ============================================================
 * GALLERY LANGUAGE
 * Monospace "wall-label" metadata + architectural hairline rules.
 * Content on open paper, divided by space and thin lines instead
 * of card chrome.
 * ============================================================ */

/* Wall label: the small mono caption beside the work — kickers,
 * dates, tags, catalogue numbers. */
@utility label-mono {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground));
  font-feature-settings: 'tnum' 1;
}

/* Full-width architectural divider between gallery sections. */
@utility gallery-rule {
  border: 0;
  border-top: 1px solid hsl(var(--border));
  width: 100%;
  margin: 0;
}

/* ============================================================
 * EDITORIAL SURFACES — flat ink-on-paper: hairline rules, tint
 * shifts, a single hover lift. No shadow blooms.
 * ============================================================ */

@utility surface {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}

@utility surface-sm {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}

@utility surface-lg {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border) / 0.9);
}

@utility surface-recessed {
  /* Recessed surface = tinted paper, not an inset shadow */
  background: hsl(var(--muted) / 0.55);
  border: 1px solid hsl(var(--border) / 0.7);
}

@utility surface-button {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    transform 0.1s ease;

  &:hover {
    background: hsl(var(--primary) / 0.06);
    border-color: hsl(var(--primary) / 0.45);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
  }
}

@utility surface-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: hsl(var(--primary) / 0.45);
    transform: translateY(-2px);
  }
}

@utility surface-input {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  transition: border-color 0.15s ease;

  &:focus {
    border-color: hsl(var(--primary) / 0.5);
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
  }
}

@utility cta-primary {
  @apply inline-flex items-center justify-center font-semibold transition-all;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--primary) / 0.42);
  box-shadow: 0 1px 0 hsl(var(--primary) / 0.25);

  &:hover {
    color: hsl(var(--primary-foreground));
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
  }

  &:disabled {
    background-color: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
    border-color: hsl(var(--border));
    box-shadow: none;
  }

  &[aria-disabled='true'] {
    background-color: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
    border-color: hsl(var(--border));
    box-shadow: none;
  }
}

@utility cta-secondary {
  @apply inline-flex items-center justify-center font-medium transition-all;
  color: hsl(var(--foreground));
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));

  &:hover {
    color: hsl(var(--foreground));
    border-color: hsl(var(--primary) / 0.45);
    background: hsl(var(--primary) / 0.05);
  }

  &:focus-visible {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
  }

  &:disabled {
    color: hsl(var(--muted-foreground));
    border-color: hsl(var(--border));
    box-shadow: none;
  }

  &[aria-disabled='true'] {
    color: hsl(var(--muted-foreground));
    border-color: hsl(var(--border));
    box-shadow: none;
  }
}

@utility cta-link {
  @apply text-primary font-semibold;
}

@utility reveal {
  /* Scroll reveal primitives (IntersectionObserver toggles data-reveal-state) */
  --reveal-y: 14px;
  --reveal-delay: 0ms;
  --reveal-duration: 650ms;
  --reveal-ease: cubic-bezier(0.22, 1, 0.36, 1);

  opacity: 0;
  transform: translate3d(0, var(--reveal-y), 0);
  /* Soften the in→out flip on hydration for below-fold elements. */
  transition: opacity 220ms ease;

  &[data-reveal-state='in'] {
    animation: reveal-in var(--reveal-duration) var(--reveal-ease) both;
    animation-delay: var(--reveal-delay);
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
    &[data-reveal-state='in'] {
      opacity: 1 !important;
      transform: none !important;
      animation: none !important;
      transition: none !important;
    }
  }
}

/* ============================================
 * TYPOGRAPHY — fluid, distinctive scale
 * ============================================ */

@utility text-display {
  font-size: clamp(2.4rem, 5.2vw, 4.9rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
  font-weight: 720;
  font-variant-numeric: oldstyle-nums;
}

@utility text-page-title {
  font-size: clamp(1.9rem, 3.6vw, 3.2rem);
  line-height: 1.12;
  letter-spacing: -0.03em;
  font-weight: 700;
}

@utility text-section-title {
  font-size: clamp(1.55rem, 2.4vw, 2.25rem);
  line-height: 1.18;
  letter-spacing: -0.026em;
  font-weight: 650;
}

@utility text-card-title {
  font-size: 1.25rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-weight: 620;
}

@utility text-subsection {
  font-size: 1.075rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  font-weight: 560;
}

@utility text-body-lg {
  @apply text-lg text-foreground leading-relaxed;
}

@utility text-body {
  @apply text-base text-foreground leading-relaxed;
}

@utility text-body-sm {
  @apply text-sm text-foreground leading-normal;
}

@utility text-description {
  @apply text-base text-muted-foreground leading-relaxed;
}

@utility text-description-sm {
  @apply text-sm text-muted-foreground leading-normal;
}

@utility text-label {
  @apply text-sm font-medium text-foreground;
}

/* ============================================
 * LAYOUT
 * ============================================ */

@utility section-padding {
  @apply py-16 sm:py-20 lg:py-24;
}

@utility section-padding-sm {
  @apply py-8 sm:py-12 lg:py-16;
}

@utility card-padding {
  @apply p-6 sm:p-8;
}

@utility card-padding-sm {
  @apply p-4 sm:p-6;
}

@utility content-narrow {
  @apply max-w-2xl mx-auto;
}

@utility content-medium {
  @apply max-w-4xl mx-auto;
}

@utility content-wide {
  @apply max-w-6xl mx-auto;
}

@utility focus-ring {
  @apply focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background;
}

@utility skeleton-shimmer {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  .dark &::after {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }
}

@utility glass {
  background: hsl(var(--background) / 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.5);

  .dark & {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@utility glass-subtle {
  background: hsl(var(--background) / 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid hsl(var(--border) / 0.3);

  .dark & {
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
}

@utility glass-heavy {
  background: hsl(var(--background) / 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid hsl(var(--border) / 0.7);

  .dark & {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
}

@utility nav-underline {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: hsl(var(--primary));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::after {
    transform: scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
}

@utility nav-underline-active {
  &::after {
    transform: scaleX(1);
  }
}

@layer base {
  :root {
    --background: 38 25% 97%;
    --foreground: 210 15% 12%;
    --card: 38 25% 98%;
    --card-foreground: 210 15% 12%;
    --popover: 38 25% 98%;
    --popover-foreground: 210 15% 12%;
    --primary: 152 52% 20%;
    --primary-foreground: 0 0% 100%;
    --secondary: 152 38% 36%;
    --secondary-foreground: 0 0% 100%;
    --muted: 38 18% 92%;
    --muted-foreground: 215 10% 42%;
    --accent: 32 50% 92%;
    --accent-foreground: 215 15% 16%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 30 18% 86%;
    --input: 30 18% 86%;
    --ring: var(--primary);
    --radius: 0.75rem;

    --success: 142 76% 36%;
    --success-foreground: 0 0% 100%;
    --success-muted: 142 76% 36% / 0.1;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 0%;
    --warning-muted: 38 92% 50% / 0.1;
    --info: 217 91% 60%;
    --info-foreground: 0 0% 100%;
    --info-muted: 217 91% 60% / 0.1;

    --duration-fast: 150ms;
    --duration-default: 200ms;
    --duration-slow: 300ms;

    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
  }

  .dark {
    --background: 220 15% 8%;
    --foreground: 0 0% 98%;
    --card: 220 15% 10%;
    --card-foreground: 0 0% 98%;
    --popover: 220 15% 10%;
    --popover-foreground: 0 0% 98%;
    --primary: 152 44% 46%;
    --primary-foreground: 220 15% 8%;
    --secondary: 152 38% 32%;
    --secondary-foreground: 220 15% 8%;
    --muted: 220 10% 16%;
    --muted-foreground: 220 10% 70%;
    --accent: 210 16% 16%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 220 10% 18%;
    --input: 220 10% 18%;
    --ring: var(--primary);

    --success: 142 71% 45%;
    --success-foreground: 0 0% 100%;
    --success-muted: 142 71% 45% / 0.15;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 0%;
    --warning-muted: 38 92% 50% / 0.15;
    --info: 217 91% 60%;
    --info-foreground: 0 0% 100%;
    --info-muted: 217 91% 60% / 0.15;
  }

  body {
    font-family: var(--font-body);
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    line-height: 1.65;
    overflow-x: clip;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .text-display,
  .text-page-title,
  .text-section-title,
  .text-card-title,
  .text-subsection {
    font-family: var(--font-display);
    letter-spacing: -0.02em;
    line-height: 1.1;
    font-optical-sizing: auto;
  }

  /* Owned accent: selecting text tints it with the primary — a small
   * signature every reader touches. */
  ::selection {
    background: hsl(var(--primary) / 0.22);
    color: hsl(var(--foreground));
  }

  /* Paper grain: fixed, near-invisible noise that keeps large flat areas
   * from reading as sterile screen-white. Pure CSS, no asset request. */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 80;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
}

@layer utilities {
  @keyframes reveal-in {
    from {
      opacity: 0;
      transform: translate3d(0, var(--reveal-y), 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
}

@layer components {
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

/* Editorial drop cap: first letter of an essay set large in the display
 * serif, like the opening initial of a printed article. */
.prose-gallery > div > p:first-of-type::first-letter,
.prose-gallery > p:first-of-type::first-letter {
  float: left;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 3.4em;
  line-height: 0.78;
  margin: 0.05em 0.09em 0 0;
  color: hsl(var(--primary));
}

@media (prefers-reduced-motion: no-preference) {
  .prose-gallery :is(h2, h3) {
    scroll-margin-top: 6rem;
  }
}
```

- [ ] **Step 4: Wire the gallery app to the theme**

Replace `app/globals.css`:
```css
@import 'tailwindcss';
@plugin "@tailwindcss/typography";
@import '../registry/theme/identity.css';
```

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { fontVariables } from "@/registry/theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI — identity registry",
  description: "The lscaturchio identity as a reusable shadcn registry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify**

Run: `bun test && bun run build`
Expected: tests PASS; build succeeds. Then `bun run dev`, load http://localhost:3000 — page shows warm paper background (not white), body text in Instrument Sans.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: identity theme — tokens, gallery language, fonts"
```

---

### Task 3: Primitive components + components gallery section

**Files:**
- Create: `registry/ui/button.tsx`, `registry/ui/card.tsx`, `registry/ui/badge.tsx`, `registry/ui/accordion.tsx`, `registry/ui/avatar.tsx`, `registry/ui/section.tsx`, `registry/ui/theme-toggle.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`; theme utility classes from Task 2.
- Produces: `Button` (variants: default/destructive/outline/secondary/ghost/link/primary; sizes: default/sm/lg/icon; `asChild`), `buttonVariants`; `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`, `CardContent`; `Badge` (variants: default/secondary/destructive/outline), `badgeVariants`; `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`; `Avatar`, `AvatarImage`, `AvatarFallback`; `Section` (props: size/padding/id/divider/topDivider/reveal/background), `SectionHeader` (props: title/description/align/action/index/eyebrow); `ThemeToggle`.

- [ ] **Step 1: Copy verbatim files and apply the rename map**

```bash
SRC=/Users/natalyscaturchio/code/lscaturchio.xyz/src/components
mkdir -p registry/ui
cp "$SRC/ui/button.tsx"    registry/ui/button.tsx
cp "$SRC/ui/card.tsx"      registry/ui/card.tsx
cp "$SRC/ui/accordion.tsx" registry/ui/accordion.tsx
cp "$SRC/ui/avatar.tsx"    registry/ui/avatar.tsx
cp "$SRC/ui/Section.tsx"   registry/ui/section.tsx
cp "$SRC/ui/theme-toggle.tsx" registry/ui/theme-toggle.tsx
sed -i '' -e 's/neu-flat-sm/surface-sm/g' -e 's/neu-flat-lg/surface-lg/g' \
  -e 's/neu-flat/surface/g' -e 's/neu-pressed-sm/surface-recessed/g' \
  -e 's/neu-pressed/surface-recessed/g' -e 's/neu-button/surface-button/g' \
  -e 's/neu-card/surface-card/g' -e 's/neu-input/surface-input/g' \
  registry/ui/*.tsx
grep -rn "neu-" registry/ && echo "RENAME MISSED" || echo "renames clean"
```

Expected: `renames clean`. (`@/lib/utils` imports stay as-is — the gallery resolves them via tsconfig, consumers via shadcn's `utils` dependency.)

- [ ] **Step 2: Write `registry/ui/badge.tsx` (restyled — the source used legacy neu shadows)**

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary/40",
        secondary:
          "surface-sm bg-background text-foreground hover:text-primary",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive/40",
        outline: "surface-sm text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

- [ ] **Step 3: Build the gallery home page**

Replace `app/page.tsx` (uses only items that exist by this task; the Patterns link goes live in Task 4):
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/ui/accordion";
import { Avatar, AvatarFallback } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/ui/card";
import { Section, SectionHeader } from "@/registry/ui/section";
import { ThemeToggle } from "@/registry/ui/theme-toggle";

const COLOR_TOKENS = [
  "background", "foreground", "card", "muted", "accent",
  "primary", "secondary", "destructive", "success", "warning", "info", "border",
] as const;

const TYPE_SCALE = [
  { cls: "text-display", label: "text-display" },
  { cls: "text-page-title", label: "text-page-title" },
  { cls: "text-section-title", label: "text-section-title" },
  { cls: "text-card-title", label: "text-card-title" },
  { cls: "text-subsection", label: "text-subsection" },
] as const;

export default function Home() {
  return (
    <main>
      <Section size="default" padding="default">
        <p className="label-mono mb-4">GR8MONK3YS — IDENTITY REGISTRY</p>
        <h1 className="text-display">Warm paper, forest green, gallery language.</h1>
        <p className="text-description mt-6 max-w-2xl">
          The lscaturchio.xyz identity as reusable tokens, components, and
          patterns. Pull any piece with <code className="font-mono text-sm">npx shadcn add</code>.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <a className="cta-primary rounded-xl px-6 py-3" href="/patterns">Patterns</a>
          <a className="cta-secondary rounded-xl px-6 py-3" href="https://github.com/gr8monk3ys/ui">GitHub</a>
          <ThemeToggle />
        </div>
      </Section>

      <Section id="colors" topDivider>
        <SectionHeader index="01" eyebrow="TOKENS" title="Colors"
          description="Warm-paper light, slate-night dark, forest-green primary. hsl custom properties." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COLOR_TOKENS.map((token) => (
            <div key={token} className="surface rounded-xl p-3">
              <div
                className="h-14 w-full rounded-lg border"
                style={{ background: `hsl(var(--${token}))` }}
              />
              <p className="label-mono mt-2">--{token}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="typography" topDivider>
        <SectionHeader index="02" eyebrow="TOKENS" title="Typography"
          description="Fraunces display, Instrument Sans body, IBM Plex Mono wall labels. Fluid clamp() scale." />
        <div className="space-y-6">
          {TYPE_SCALE.map(({ cls, label }) => (
            <div key={cls}>
              <p className="label-mono mb-1">{label}</p>
              <p className={cls}>The quick brown fox</p>
            </div>
          ))}
          <div>
            <p className="label-mono mb-1">label-mono</p>
            <p className="label-mono">CATALOGUE NO. 004 — EST. 2026</p>
          </div>
        </div>
      </Section>

      <Section id="components" topDivider>
        <SectionHeader index="03" eyebrow="REGISTRY" title="Components" />
        <div className="space-y-10">
          <div>
            <p className="label-mono mb-3">BUTTON</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Default</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
          <div>
            <p className="label-mono mb-3">BADGE</p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>
          <div>
            <p className="label-mono mb-3">CARD</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Editorial card</CardTitle>
                  <CardDescription>Hairline border, hover lift, no chrome.</CardDescription>
                </CardHeader>
                <CardContent className="text-body-sm">
                  Content on open paper, divided by space and thin lines.
                </CardContent>
              </Card>
              <div className="surface-recessed rounded-2xl card-padding-sm">
                <p className="label-mono mb-2">SURFACE-RECESSED</p>
                <p className="text-body-sm">Tinted paper, not an inset shadow.</p>
              </div>
            </div>
          </div>
          <div>
            <p className="label-mono mb-3">ACCORDION + AVATAR</p>
            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="a">
                  <AccordionTrigger>What is this?</AccordionTrigger>
                  <AccordionContent>A reusable identity, one shadcn add away.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                  <AccordionTrigger>What can I change?</AccordionTrigger>
                  <AccordionContent>--primary and --radius. Nothing else.</AccordionContent>
                </AccordionItem>
              </Accordion>
              <Avatar>
                <AvatarFallback>LS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run: `bun run build`
Expected: build succeeds. Then `bun run dev` → home page renders all sections; theme toggle flips to dark slate; button hover tints green.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: primitive components (button, card, badge, accordion, avatar, section, theme-toggle) + gallery"
```

---

### Task 4: Patterns + patterns gallery page

**Files:**
- Create: `registry/patterns/reveal.tsx`, `registry/patterns/active-nav-link.tsx`, `registry/patterns/navigation-path.ts`, `registry/patterns/breadcrumb-nav.tsx`, `registry/patterns/scroll-to-top.tsx`, `registry/patterns/skeleton.tsx`, `app/patterns/page.tsx`
- Test: `tests/navigation-path.test.ts`

**Interfaces:**
- Consumes: `cn`, theme classes (`reveal`, `nav-underline`, `skeleton-shimmer`, `surface-button`, `label-mono`).
- Produces: `Reveal` (props: y/delayMs/once/margin/threshold), `ActiveNavLink` (props: href/activeClassName/inactiveClassName), `isPathActive(pathname, href): boolean`, `getHrefPath(href): string`, `BreadcrumbNav` (props: homeLabel/excludeHome/customSegments), `ScrollToTop`, `Skeleton` (div with className passthrough).

- [ ] **Step 1: Write failing test for navigation-path**

`tests/navigation-path.test.ts`:
```ts
import { describe, expect, test } from "bun:test";
import { getHrefPath, isPathActive } from "../registry/patterns/navigation-path";

describe("getHrefPath", () => {
  test("strips fragments", () => {
    expect(getHrefPath("/blog#latest")).toBe("/blog");
  });
});

describe("isPathActive", () => {
  test("home matches only exactly", () => {
    expect(isPathActive("/", "/")).toBe(true);
    expect(isPathActive("/blog", "/")).toBe(false);
  });
  test("section matches itself and children", () => {
    expect(isPathActive("/blog", "/blog")).toBe(true);
    expect(isPathActive("/blog/post-1", "/blog")).toBe(true);
    expect(isPathActive("/blogroll", "/blog")).toBe(false);
  });
});
```

Run: `bun test tests/navigation-path.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 2: Implement navigation-path and copy reveal**

`registry/patterns/navigation-path.ts` — copy verbatim from `/Users/natalyscaturchio/code/lscaturchio.xyz/src/lib/navigation-path.ts` (exports `getHrefPath`, `isPathActive`; no changes).

```bash
mkdir -p registry/patterns
cp /Users/natalyscaturchio/code/lscaturchio.xyz/src/lib/navigation-path.ts registry/patterns/navigation-path.ts
cp /Users/natalyscaturchio/code/lscaturchio.xyz/src/components/motion/reveal.tsx registry/patterns/reveal.tsx
```

Run: `bun test` — Expected: PASS.

- [ ] **Step 3: Write `registry/patterns/active-nav-link.tsx`** (import path for the helper changes to `@/lib/navigation-path`; shadcn places the helper there in consumers, and the gallery aliases it — see Step 6)

```tsx
"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isPathActive } from "@/lib/navigation-path";
import { cn } from "@/lib/utils";

interface ActiveNavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

/** Nav link with the slide-in underline; underline sticks when active. */
export function ActiveNavLink({
  href,
  children,
  className,
  activeClassName,
  inactiveClassName,
}: ActiveNavLinkProps) {
  const pathname = usePathname();
  const active = isPathActive(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "nav-underline",
        active && "nav-underline-active",
        className,
        active ? activeClassName : inactiveClassName,
      )}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 4: Write breadcrumb, scroll-to-top, skeleton**

`registry/patterns/breadcrumb-nav.tsx` — copy from `/Users/natalyscaturchio/code/lscaturchio.xyz/src/components/ui/breadcrumb-nav.tsx`, then remove the structured-data coupling (app-specific SEO):
1. Delete line `import { BreadcrumbStructuredData } from "./structured-data";`
2. In the JSX, delete the `<BreadcrumbStructuredData ... />` element (and its wrapping fragment if one becomes redundant).
3. `grep -n "StructuredData" registry/patterns/breadcrumb-nav.tsx` must return nothing.

`registry/patterns/scroll-to-top.tsx` (rewritten without the Button dependency so the item stands alone):
```tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating back-to-top button; appears after 300px of scroll. */
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="surface-button fixed bottom-6 right-6 z-(--z-fixed) inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:text-primary"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
```

`registry/patterns/skeleton.tsx`:
```tsx
import { cn } from "@/lib/utils";

/** Loading placeholder block with the identity's shimmer sweep. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-xl bg-muted", className)}
      {...props}
    />
  );
}
```

- [ ] **Step 5: Write `app/patterns/page.tsx`**

```tsx
import { ActiveNavLink } from "@/registry/patterns/active-nav-link";
import { BreadcrumbNav } from "@/registry/patterns/breadcrumb-nav";
import { Reveal } from "@/registry/patterns/reveal";
import { ScrollToTop } from "@/registry/patterns/scroll-to-top";
import { Skeleton } from "@/registry/patterns/skeleton";
import { Section, SectionHeader } from "@/registry/ui/section";

export default function PatternsPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader index="04" eyebrow="REGISTRY" title="Patterns"
          description="Signature interactive pieces: scroll reveal, nav underline, breadcrumb, scroll-to-top, skeleton." />

        <div className="space-y-12">
          <div>
            <p className="label-mono mb-3">ACTIVE-NAV-LINK</p>
            <nav className="flex gap-6">
              <ActiveNavLink href="/" className="pb-1">Home</ActiveNavLink>
              <ActiveNavLink href="/patterns" className="pb-1">Patterns</ActiveNavLink>
            </nav>
          </div>

          <div>
            <p className="label-mono mb-3">SKELETON</p>
            <div className="grid max-w-md gap-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          <div>
            <p className="label-mono mb-3">REVEAL (scroll down)</p>
            <div className="space-y-24">
              {[1, 2, 3].map((n) => (
                <Reveal key={n} delayMs={n * 60}>
                  <div className="surface-card rounded-2xl card-padding">
                    <p className="text-card-title">Revealed block {n}</p>
                    <p className="text-description-sm mt-2">
                      Fades and settles in as it enters the viewport. Reduced-motion users see it immediately.
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>
      <ScrollToTop />
    </main>
  );
}
```

- [ ] **Step 6: Alias the helper for the gallery build**

`active-nav-link.tsx` imports `@/lib/navigation-path` (the consumer-side location). Create `lib/navigation-path.ts` in the repo root that re-exports the registry source, keeping one source of truth:
```ts
export * from "@/registry/patterns/navigation-path";
```

- [ ] **Step 7: Verify**

Run: `bun test && bun run build`
Expected: all tests PASS; build lists `/` and `/patterns`. Then `bun run dev` → /patterns: breadcrumb renders "Home › Patterns", Patterns nav link has a stuck underline, skeletons shimmer, blocks reveal on scroll, scroll-to-top appears after scrolling.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: patterns — reveal, active-nav-link, breadcrumb, scroll-to-top, skeleton"
```

---

### Task 5: Registry manifest + build + validation test

**Files:**
- Create: `registry.json`, `components.json` (needed by `shadcn build`)
- Test: `tests/registry.test.ts`
- Generated (committed): `public/r/*.json`

**Interfaces:**
- Produces: `public/r/<item>.json` for items: `theme`, `button`, `card`, `badge`, `accordion`, `avatar`, `section`, `theme-toggle`, `reveal`, `active-nav-link`, `breadcrumb-nav`, `scroll-to-top`, `skeleton`. Consumed by Task 6's smoke test and by real consumers.

- [ ] **Step 1: Write failing registry validation test**

`tests/registry.test.ts`:
```ts
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
```

Run: `bun test tests/registry.test.ts` — Expected: FAIL (registry.json missing).

- [ ] **Step 2: Write `components.json`** (shadcn CLI config for this repo)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 3: Write `registry.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "gr8monk3ys",
  "homepage": "https://github.com/gr8monk3ys/ui",
  "items": [
    {
      "name": "theme",
      "type": "registry:item",
      "title": "Identity Theme",
      "description": "Warm paper, forest green, gallery language: tokens, typography scale, surfaces, motion. Import after tailwindcss; override only --primary and --radius.",
      "files": [
        { "path": "registry/theme/identity.css", "type": "registry:file", "target": "app/identity.css" },
        { "path": "registry/theme/fonts.ts", "type": "registry:file", "target": "lib/fonts.ts" }
      ]
    },
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "description": "Editorial button; hairline border, green hover tint, cta-primary variant.",
      "dependencies": ["@radix-ui/react-slot", "class-variance-authority"],
      "registryDependencies": ["utils"],
      "files": [{ "path": "registry/ui/button.tsx", "type": "registry:ui" }]
    },
    {
      "name": "card",
      "type": "registry:ui",
      "title": "Card",
      "description": "Flat editorial card with hover lift.",
      "registryDependencies": ["utils"],
      "files": [{ "path": "registry/ui/card.tsx", "type": "registry:ui" }]
    },
    {
      "name": "badge",
      "type": "registry:ui",
      "title": "Badge",
      "description": "Flat badges on the identity palette.",
      "dependencies": ["class-variance-authority"],
      "registryDependencies": ["utils"],
      "files": [{ "path": "registry/ui/badge.tsx", "type": "registry:ui" }]
    },
    {
      "name": "accordion",
      "type": "registry:ui",
      "title": "Accordion",
      "description": "Radix accordion with hairline dividers.",
      "dependencies": ["@radix-ui/react-accordion", "lucide-react"],
      "registryDependencies": ["utils"],
      "files": [{ "path": "registry/ui/accordion.tsx", "type": "registry:ui" }]
    },
    {
      "name": "avatar",
      "type": "registry:ui",
      "title": "Avatar",
      "description": "Radix avatar.",
      "dependencies": ["@radix-ui/react-avatar"],
      "registryDependencies": ["utils"],
      "files": [{ "path": "registry/ui/avatar.tsx", "type": "registry:ui" }]
    },
    {
      "name": "section",
      "type": "registry:ui",
      "title": "Section + SectionHeader",
      "description": "Layout section with reveal and hairline dividers; museum wall-label header (index, eyebrow, rule).",
      "registryDependencies": ["utils"],
      "files": [{ "path": "registry/ui/section.tsx", "type": "registry:ui" }]
    },
    {
      "name": "theme-toggle",
      "type": "registry:ui",
      "title": "Theme Toggle",
      "description": "Light/dark toggle on next-themes.",
      "dependencies": ["next-themes", "lucide-react"],
      "files": [{ "path": "registry/ui/theme-toggle.tsx", "type": "registry:ui" }]
    },
    {
      "name": "reveal",
      "type": "registry:component",
      "title": "Reveal",
      "description": "IntersectionObserver scroll reveal; reduced-motion safe, works without JS.",
      "registryDependencies": ["utils"],
      "files": [{ "path": "registry/patterns/reveal.tsx", "type": "registry:component" }]
    },
    {
      "name": "active-nav-link",
      "type": "registry:component",
      "title": "ActiveNavLink",
      "description": "Nav link with slide-in underline; sticks when the route is active.",
      "registryDependencies": ["utils"],
      "files": [
        { "path": "registry/patterns/active-nav-link.tsx", "type": "registry:component" },
        { "path": "registry/patterns/navigation-path.ts", "type": "registry:lib", "target": "lib/navigation-path.ts" }
      ]
    },
    {
      "name": "breadcrumb-nav",
      "type": "registry:component",
      "title": "BreadcrumbNav",
      "description": "Path-derived breadcrumb with mono styling.",
      "dependencies": ["lucide-react"],
      "files": [{ "path": "registry/patterns/breadcrumb-nav.tsx", "type": "registry:component" }]
    },
    {
      "name": "scroll-to-top",
      "type": "registry:component",
      "title": "ScrollToTop",
      "description": "Floating back-to-top button on the surface-button style.",
      "dependencies": ["lucide-react"],
      "files": [{ "path": "registry/patterns/scroll-to-top.tsx", "type": "registry:component" }]
    },
    {
      "name": "skeleton",
      "type": "registry:component",
      "title": "Skeleton",
      "description": "Loading block with the identity shimmer.",
      "registryDependencies": ["utils"],
      "files": [{ "path": "registry/patterns/skeleton.tsx", "type": "registry:component" }]
    }
  ]
}
```

- [ ] **Step 4: Build the registry and run tests**

Run: `bun run registry:build && bun test`
Expected: `public/r/*.json` created (13 files); all tests PASS. If `shadcn build` rejects a `type` value, consult `bunx shadcn@latest build --help` and the schema at https://ui.shadcn.com/schema/registry.json, adjust, and re-run — the test suite is the acceptance gate.

- [ ] **Step 5: Verify serving**

Run: `bun run build` then `bun run start &` and `curl -s http://localhost:3000/r/button.json | head -c 200`
Expected: JSON body starting with the item's schema/name. Kill the server after.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: registry manifest, build output, and validation tests"
```

---

### Task 6: Consumer smoke test

**Files:**
- Create: `scripts/smoke-fixture/package.json`, `scripts/smoke-fixture/tsconfig.json`, `scripts/smoke-fixture/components.json`, `scripts/smoke-fixture/next.config.ts`, `scripts/smoke-fixture/postcss.config.mjs`, `scripts/smoke-fixture/app/globals.css`, `scripts/smoke-fixture/app/layout.tsx`, `scripts/smoke-fixture/app/page.tsx`, `scripts/smoke-registry.ts`

**Interfaces:**
- Consumes: `public/r/*.json` from Task 5.
- Produces: `bun run smoke` — exits 0 iff a fresh consumer can `shadcn add` the theme + button + reveal from the built registry over HTTP and `next build` cleanly.

- [ ] **Step 1: Write the fixture (a minimal real consumer)**

`scripts/smoke-fixture/package.json`:
```json
{
  "name": "smoke-consumer",
  "private": true,
  "scripts": { "build": "next build" },
  "dependencies": {
    "next": "^16.1.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.1",
    "@types/node": "^25.5.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "tailwindcss": "^4.2.1",
    "typescript": "^5.7.0"
  }
}
```

`scripts/smoke-fixture/tsconfig.json`: same as the repo root one but with `"paths": { "@/*": ["./*"] }` and without the `exclude` of smoke-fixture:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

`scripts/smoke-fixture/components.json`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

`scripts/smoke-fixture/next.config.ts`:
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
```

`scripts/smoke-fixture/postcss.config.mjs`:
```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`scripts/smoke-fixture/app/globals.css` (consumes the identity exactly as the README will document, including the two knobs):
```css
@import 'tailwindcss';
@import './identity.css';

:root {
  --primary: 262 60% 35%;
  --radius: 0.5rem;
}
```

`scripts/smoke-fixture/app/layout.tsx`:
```tsx
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
```

`scripts/smoke-fixture/app/page.tsx` (imports prove the added files resolve):
```tsx
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <main className="p-8">
      <p className="label-mono">SMOKE CONSUMER</p>
      <Reveal>
        <Button variant="primary">It landed</Button>
      </Reveal>
    </main>
  );
}
```

- [ ] **Step 2: Write `scripts/smoke-registry.ts`**

```ts
/**
 * End-to-end registry smoke test:
 * 1. Serve ./public over HTTP (the real consumption path).
 * 2. Copy the fixture consumer to a temp dir, install deps.
 * 3. `shadcn add` theme + button + reveal from the served registry.
 * 4. Assert the files landed, then `next build` the consumer.
 * Exits non-zero on any failure.
 */
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

const ROOT = join(import.meta.dir, "..");
const PORT = 4873;

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const path = new URL(req.url).pathname;
    const file = Bun.file(join(ROOT, "public", path));
    return file.exists().then((ok) => (ok ? new Response(file) : new Response("nope", { status: 404 })));
  },
});

const work = mkdtempSync(join(tmpdir(), "ui-smoke-"));
console.log(`smoke consumer at ${work}`);

let failed = false;
try {
  cpSync(join(ROOT, "scripts/smoke-fixture"), work, { recursive: true });
  await $`bun install`.cwd(work);

  const base = `http://localhost:${PORT}/r`;
  await $`bunx --bun shadcn@latest add ${base}/theme.json ${base}/button.json ${base}/reveal.json --yes --overwrite`.cwd(work);

  const expected = [
    "app/identity.css",
    "lib/fonts.ts",
    "lib/utils.ts",
    "components/ui/button.tsx",
    "components/reveal.tsx",
  ];
  for (const f of expected) {
    if (!existsSync(join(work, f))) throw new Error(`expected file missing after add: ${f}`);
  }
  console.log("all expected files landed");

  await $`bun run build`.cwd(work);
  console.log("consumer build OK");
} catch (err) {
  failed = true;
  console.error("SMOKE FAILED:", err);
} finally {
  server.stop(true);
  rmSync(work, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
```

Note: if `shadcn add` places `reveal.tsx` at a different target (e.g. `components/reveal.tsx` vs `components/ui/reveal.tsx` depends on file `type`), adjust the `expected` list AND the fixture's `app/page.tsx` import to match observed behavior — the assertion must reflect where the CLI actually puts `registry:component` files.

- [ ] **Step 3: Run it**

Run: `bun run smoke`
Expected: `all expected files landed`, `consumer build OK`, exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "test: end-to-end consumer smoke for the registry"
```

---

### Task 7: CI + README

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`

**Interfaces:**
- Produces: a required-check candidate named `ci` that runs on `pull_request` (fleet rule: required checks must fire on PR events).

- [ ] **Step 1: Write `.github/workflows/ci.yml`**

```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun test
      - run: bun run registry:build
      - run: git diff --exit-code public/r
      - run: bun run build
      - run: bun run smoke
```

(`git diff --exit-code public/r` fails the build if someone edits registry sources without rebuilding the committed output.)

- [ ] **Step 2: Write `README.md`**

Replace the stub with (full content):

````markdown
# ui

The [lscaturchio.xyz](https://lscaturchio.xyz) visual identity — warm paper,
forest green, Fraunces/Instrument Sans/IBM Plex Mono, monospace wall labels,
hairline dividers, restrained motion — packaged as a shadcn registry so any
of my apps can adopt it.

## Use it

```bash
# the theme (tokens + fonts) — start here
npx shadcn@latest add <REGISTRY_URL>/r/theme.json

# then any components you want
npx shadcn@latest add <REGISTRY_URL>/r/button.json <REGISTRY_URL>/r/card.json
```

Wire it up:

```css
/* app/globals.css */
@import 'tailwindcss';
@import './identity.css';
```

```tsx
// app/layout.tsx
import { fontVariables } from "@/lib/fonts";
// <html className={fontVariables} suppressHydrationWarning>
```

## The rules

The paper, typography, and gallery language ARE the identity — do not
override them. Each app may set exactly two knobs, after the import:

```css
:root {
  --primary: 262 60% 35%;  /* your accent hue (hsl triplet) */
  --radius: 0.5rem;        /* corner personality */
}
```

`--ring` and the whole radius scale follow automatically.

## Items

| Item | What |
|---|---|
| `theme` | identity.css (tokens, type scale, surfaces, motion) + fonts.ts |
| `button` `card` `badge` `accordion` `avatar` `section` `theme-toggle` | styled primitives |
| `reveal` `active-nav-link` `breadcrumb-nav` `scroll-to-top` `skeleton` | signature patterns |

## Develop

```bash
bun install
bun run dev            # gallery at localhost:3000
bun test               # unit + registry validation
bun run registry:build # rebuild public/r/*.json (commit the output)
bun run smoke          # end-to-end consumer test
```
````

(Replace `<REGISTRY_URL>` with the Vercel deployment URL once deployed — Task 8 does this.)

- [ ] **Step 3: Verify locally**

Run: `bun test && bun run build`
Expected: PASS. (The workflow itself is proven on the PR.)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "ci: registry build check, tests, smoke; document consumption"
```

---

### Task 8: Ship — push, PR, deploy, finalize URLs

**Files:**
- Modify: `README.md`, `registry.json` (real deployment URL)

- [ ] **Step 1: Push and open PR**

```bash
git push -u origin identity-registry
gh pr create --title "UI identity registry: theme, components, patterns, gallery" \
  --body "$(cat <<'EOF'
Captures the lscaturchio.xyz identity as a shadcn registry + gallery app per
docs/superpowers/specs/2026-08-07-ui-identity-registry-design.md.

- identity.css tokens + gallery language (surface-* renames, two knobs: --primary/--radius)
- 7 primitives, 5 patterns, all independently addable
- registry.json → public/r/*.json via shadcn build (drift-checked in CI)
- end-to-end smoke: scratch consumer does shadcn add over HTTP and builds

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

NOT a draft (fleet rule). Confirm the `ci` check runs on the PR head.

- [ ] **Step 2: Deploy gallery to Vercel** (preview is fine; production after merge)

Use the Vercel integration/CLI to deploy the repo. Record the stable deployment URL.

- [ ] **Step 3: Replace `<REGISTRY_URL>` in README.md and set `homepage` in registry.json to the deployment URL; rebuild registry; commit and push**

```bash
bun run registry:build
git add -A && git commit -m "docs: point registry URLs at deployment" && git push
```

- [ ] **Step 4: Final verification**

Run: `curl -s <REGISTRY_URL>/r/theme.json | head -c 200`
Expected: registry item JSON from the live deployment. Report PR URL + deployment URL as the deliverable.

---

## Self-review notes

- Spec coverage: theme (Task 2), fonts (Task 2), 7 primitives (Task 3; `section-heading` folded into `section` per approved deviation), 5 patterns (Task 4), knobs + ring-follows-primary (Task 2 CSS), gallery (Tasks 3–4), registry + manifest (Task 5), smoke (Task 6), CI + README rules (Task 7), Vercel + live URLs (Task 8). Drop list honored — nothing site-specific is registered.
- Known uncertainty, handled in-plan: exact shadcn CLI behavior for `registry:component` target paths (Task 6 note) and `registry:item`/`registry:file` type acceptance (Task 5 Step 4 note). The validation tests and smoke test are the acceptance gates either way.
- Type consistency: `SectionHeader` (not `SectionHeading`) throughout; `fontVariables` string export used by gallery layout, fixture layout, and README; `surface-*` names identical in CSS (Task 2), sed map (Task 3), and badge/scroll-to-top rewrites.

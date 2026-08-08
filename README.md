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

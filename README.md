# ui

The [lscaturchio.xyz](https://lscaturchio.xyz) visual identity — warm paper,
forest green, Fraunces/Instrument Sans/IBM Plex Mono, monospace wall labels,
hairline dividers, restrained motion — packaged as a shadcn registry so any
of my apps can adopt it.

## Use it

```bash
# the theme (tokens + fonts) — start here
npx shadcn@latest add https://ui.lscaturchio.xyz/r/theme.json

# then any components you want
npx shadcn@latest add https://ui.lscaturchio.xyz/r/button.json https://ui.lscaturchio.xyz/r/card.json
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

| Category | Items |
|---|---|
| Theme | `theme` (identity.css + fonts.ts; add `@import 'tw-animate-css';` alongside) |
| Identity primitives | `button` `card` `badge` `accordion` `avatar` `section` `theme-toggle` `skeleton` |
| Patterns | `reveal` `active-nav-link` `breadcrumb-nav` `scroll-to-top` |
| Forms & inputs | `button-group` `calendar` `checkbox` `combobox` `field` `form` `input` `input-group` `input-otp` `label` `native-select` `radio-group` `select` `slider` `switch` `textarea` `toggle` `toggle-group` |
| Overlays | `alert-dialog` `command` `context-menu` `dialog` `drawer` `dropdown-menu` `hover-card` `menubar` `popover` `sheet` `sonner` `tooltip` |
| Navigation | `breadcrumb` `direction` `navigation-menu` `pagination` `sidebar` `tabs` |
| Data display | `aspect-ratio` `carousel` `chart` `empty` `item` `kbd` `marker` `table` |
| Feedback | `alert` `progress` `spinner` |
| Layout | `collapsible` `resizable` `scroll-area` `separator` |
| AI chat | `attachment` `bubble` `message` `message-scroller` |
| Hooks | `use-mobile` |

Upstream lists `toast` and `questionnaire` but publishes no installable item
for them (their own CLI 404s); they'll be added when upstream ships them.

## Develop

```bash
bun install
bun run dev            # gallery at localhost:3000
bun test               # unit + registry validation
bun run registry:build # rebuild public/r/*.json (commit the output)
bun run smoke          # end-to-end consumer test
```

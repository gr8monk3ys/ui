import Link from "next/link";

import { CATALOG_TOTAL, CATEGORIES, REGISTRY_BASE_URL } from "./catalog";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border/60">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="label-mono mb-3">GR8MONK3YS — IDENTITY REGISTRY</p>
            <p className="text-description-sm max-w-xs">
              Warm paper, forest green, gallery language. {CATALOG_TOTAL} items,
              each one <code className="font-mono text-xs">npx shadcn add</code> away.
            </p>
          </div>

          <div>
            <p className="label-mono mb-3">CATALOG</p>
            <ul className="grid gap-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/components/${c.slug}`} className="text-foreground/70 hover:text-foreground">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-mono mb-3">ELSEWHERE</p>
            <ul className="grid gap-2 text-sm">
              <li>
                <Link href="/patterns" className="text-foreground/70 hover:text-foreground">
                  Patterns
                </Link>
              </li>
              <li>
                <a href={`${REGISTRY_BASE_URL}/registry.json`} className="text-foreground/70 hover:text-foreground">
                  registry.json
                </a>
              </li>
              <li>
                <a href="https://github.com/gr8monk3ys/ui" className="text-foreground/70 hover:text-foreground">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://lscaturchio.xyz" className="text-foreground/70 hover:text-foreground">
                  lscaturchio.xyz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="gallery-rule my-8" />
        <p className="label-mono">CATALOGUE NO. 004 — EST. 2026</p>
      </div>
    </footer>
  );
}

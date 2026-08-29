import Image from "next/image";
import Link from "next/link";

import { ActiveNavLink } from "@/components/patterns/active-nav-link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV = [
  { href: "/components", label: "Components" },
  { href: "/patterns", label: "Patterns" },
] as const;

/**
 * The registry's own header, carrying the same cursive wordmark the source site
 * uses. The registry IS the identity, so the shell has to be an example of it.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex shrink-0 items-center rounded-md">
          <Image
            src="/cursive.svg"
            alt="Lorenzo Scaturchio — identity registry"
            width={200}
            height={40}
            priority
            className="h-7 w-auto dark:invert sm:h-12"
          />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-6">
          {NAV.map((item) => (
            <ActiveNavLink
              key={item.href}
              href={item.href}
              className="pb-1 text-sm font-medium"
              activeClassName="text-foreground"
              inactiveClassName="text-foreground/70 hover:text-foreground"
            >
              {item.label}
            </ActiveNavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

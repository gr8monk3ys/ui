import { DemoBlock } from "@/components/gallery/demo-block";
import { InstallCommand } from "@/components/gallery/install-command";
import { NoPreviewCard } from "@/components/gallery/no-preview-card";
import { ActiveNavLink } from "@/components/patterns/active-nav-link";
import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Reveal } from "@/components/patterns/reveal";
import { ScrollToTop } from "@/components/patterns/scroll-to-top";
import { Section, SectionHeader } from "@/components/ui/section";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function PatternsPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader as="h1" index="04" eyebrow="REGISTRY" title="Patterns & foundations"
          description="The six items that are not components: the theme itself, the interactive behaviours built on it, and the hook they share." />

        <div className="grid gap-10 lg:grid-cols-2">
          <DemoBlock label="ACTIVE-NAV-LINK" items={["active-nav-link"]}>
            <nav className="flex flex-wrap gap-6">
              <ActiveNavLink href="/" className="pb-1">Home</ActiveNavLink>
              <ActiveNavLink href="/patterns" className="pb-1">Patterns</ActiveNavLink>
              <ActiveNavLink href="/components" className="pb-1">Components</ActiveNavLink>
            </nav>
          </DemoBlock>

          <DemoBlock label="BREADCRUMB-NAV" items={["breadcrumb-nav"]}>
            <BreadcrumbNav />
          </DemoBlock>

          <DemoBlock label="THEME-TOGGLE" items={["theme-toggle"]}>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-description-sm">
                The same control that sits in this site’s header.
              </span>
            </div>
          </DemoBlock>

          <DemoBlock label="SCROLL-TO-TOP" items={["scroll-to-top"]}>
            <p className="text-description-sm">
              Live on this page: scroll past the fold and it appears in the
              bottom-right corner. It is mounted below.
            </p>
          </DemoBlock>

          <NoPreviewCard
            label="THEME"
            name="theme"
            reason="The identity itself — warm-paper and slate-night token sets, the Fraunces/Instrument Sans/IBM Plex Mono stack, and the gallery-language utilities every other item is styled with. It is a stylesheet, so the preview is the page you are reading."
          />

          <NoPreviewCard
            label="USE-MOBILE"
            name="use-mobile"
            reason="A hook returning whether the viewport is below the mobile breakpoint. It renders nothing on its own; the sidebar demo on the navigation page is driven by it."
          />
        </div>

        <div className="mt-16">
          <p className="label-mono mb-3">REVEAL (SCROLL DOWN)</p>
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
          <div className="mt-8 max-w-md">
            <InstallCommand name="reveal" />
          </div>
        </div>
      </Section>
      <ScrollToTop />
    </main>
  );
}

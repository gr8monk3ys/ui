import { ActiveNavLink } from "@/components/patterns/active-nav-link";
import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Reveal } from "@/components/patterns/reveal";
import { ScrollToTop } from "@/components/patterns/scroll-to-top";
import { Skeleton } from "@/components/ui/skeleton";
import { Section, SectionHeader } from "@/components/ui/section";

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

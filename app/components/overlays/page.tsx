import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Section, SectionHeader } from "@/components/ui/section";
import { OverlaysDemos } from "./demos";

export default function OverlaysPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader as="h1" index="05.2" eyebrow="CATALOG" title="Overlays" />
        <OverlaysDemos />
      </Section>
    </main>
  );
}

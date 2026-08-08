import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Section, SectionHeader } from "@/components/ui/section";
import { LayoutDemos } from "./demos";

export default function LayoutPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader index="05.6" eyebrow="CATALOG" title="Layout" />
        <LayoutDemos />
      </Section>
    </main>
  );
}

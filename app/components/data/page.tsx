import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Section, SectionHeader } from "@/components/ui/section";
import { DataDemos } from "./demos";

export default function DataPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader index="05.4" eyebrow="CATALOG" title="Data display" />
        <DataDemos />
      </Section>
    </main>
  );
}

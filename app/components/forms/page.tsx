import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Section, SectionHeader } from "@/components/ui/section";
import { FormsDemos } from "./demos";

export default function FormsPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader index="05.1" eyebrow="CATALOG" title="Forms & inputs" />
        <FormsDemos />
      </Section>
    </main>
  );
}

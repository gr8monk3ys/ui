import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Section, SectionHeader } from "@/components/ui/section";
import { NavigationDemos } from "./demos";

export default function NavigationPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader index="05.3" eyebrow="CATALOG" title="Navigation" />
        <NavigationDemos />
      </Section>
    </main>
  );
}

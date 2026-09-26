import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Section, SectionHeader } from "@/components/ui/section";
import { FeedbackDemos } from "./demos";

export default function FeedbackPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader as="h1" index="05.5" eyebrow="CATALOG" title="Feedback" />
        <FeedbackDemos />
      </Section>
    </main>
  );
}

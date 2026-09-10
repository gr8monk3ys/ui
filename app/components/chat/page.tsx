import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { Section, SectionHeader } from "@/components/ui/section";
import { ChatDemos } from "./demos";

export default function ChatPage() {
  return (
    <main>
      <Section padding="compact">
        <BreadcrumbNav />
        <SectionHeader index="05.7" eyebrow="CATALOG" title="AI chat"
          description="Static demos — the components are UI-only and plug into any chat backend." />
        <ChatDemos />
      </Section>
    </main>
  );
}

import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";

const CATEGORIES = [
  { href: "/components/forms", label: "Forms & inputs" },
  { href: "/components/overlays", label: "Overlays" },
  { href: "/components/navigation", label: "Navigation" },
  { href: "/components/data", label: "Data display" },
  { href: "/components/feedback", label: "Feedback" },
  { href: "/components/layout", label: "Layout" },
  { href: "/components/chat", label: "AI chat" },
] as const;

export default function ComponentsIndex() {
  return (
    <main>
      <Section padding="compact">
        <SectionHeader index="05" eyebrow="REGISTRY" title="Components"
          description="The full catalog, restyled to the identity. Every item: npx shadcn add https://ui.lscaturchio.xyz/r/<name>.json" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.href} href={c.href} className="surface-card rounded-2xl card-padding-sm block">
              <span className="text-card-title">{c.label}</span>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}

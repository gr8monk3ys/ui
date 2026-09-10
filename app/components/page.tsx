import Link from "next/link";

import { CATALOG_COMPONENTS, CATEGORIES } from "@/components/gallery/catalog";
import { Section, SectionHeader } from "@/components/ui/section";

import { ChatDemos } from "./chat/demos";
import { DataDemos } from "./data/demos";
import { FeedbackDemos } from "./feedback/demos";
import { FormsDemos } from "./forms/demos";
import { LayoutDemos } from "./layout/demos";
import { NavigationDemos } from "./navigation/demos";
import { OverlaysDemos } from "./overlays/demos";

/** Category slug → the gallery that renders it. Every category has one. */
const GALLERIES = {
  forms: FormsDemos,
  overlays: OverlaysDemos,
  navigation: NavigationDemos,
  data: DataDemos,
  feedback: FeedbackDemos,
  layout: LayoutDemos,
  chat: ChatDemos,
} as const satisfies Record<string, () => React.ReactElement>;

export default function ComponentsIndex() {
  return (
    <main>
      <Section padding="compact">
        <SectionHeader
          index="05"
          eyebrow="REGISTRY"
          title="Components"
          description={`The full catalog — ${CATALOG_COMPONENTS} components across ${CATEGORIES.length} categories, every one running live below with the line that installs it.`}
        />
        <nav aria-label="Catalog categories" className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="surface-button focus-ring rounded-full px-4 py-2 text-sm"
            >
              {c.label}{" "}
              <span className="label-mono ml-1">{String(c.items.length).padStart(2, "0")}</span>
            </a>
          ))}
        </nav>
      </Section>

      {CATEGORIES.map((category) => {
        const Gallery = GALLERIES[category.slug as keyof typeof GALLERIES];
        return (
          <Section key={category.slug} id={category.slug} padding="compact" topDivider>
            <SectionHeader
              index={category.index}
              eyebrow="CATALOG"
              title={category.label}
              description={category.description}
              action={
                <Link href={`/components/${category.slug}`} className="cta-link text-sm">
                  Open {category.label.toLowerCase()} on its own page →
                </Link>
              }
            />
            {Gallery ? (
              <Gallery />
            ) : (
              <div className="surface-recessed rounded-2xl card-padding">
                <p className="text-description-sm">
                  Nothing is filed under {category.label.toLowerCase()} yet. When
                  something is, it shows up here with its install line.
                </p>
              </div>
            )}
          </Section>
        );
      })}
    </main>
  );
}

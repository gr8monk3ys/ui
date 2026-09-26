import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";

const COLOR_TOKENS = [
  "background", "foreground", "card", "muted", "accent",
  "primary", "secondary", "destructive", "success", "warning", "info", "border",
] as const;

const TYPE_SCALE = [
  { cls: "text-display", label: "text-display" },
  { cls: "text-page-title", label: "text-page-title" },
  { cls: "text-section-title", label: "text-section-title" },
  { cls: "text-card-title", label: "text-card-title" },
  { cls: "text-subsection", label: "text-subsection" },
] as const;

export default function Home() {
  return (
    <main>
      <Section size="default" padding="default">
        <p className="label-mono mb-4">GR8MONK3YS — IDENTITY REGISTRY</p>
        <h1 className="text-display">Warm Paper, Forest Green, Gallery Language.</h1>
        <p className="text-description mt-6 max-w-2xl">
          The lscaturchio.xyz identity as reusable tokens, components, and
          patterns. Pull any piece with <code className="font-mono text-sm">npx shadcn add</code>.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a className="cta-primary rounded-xl px-6 py-3" href="/components">Components</a>
          <a className="cta-secondary rounded-xl px-6 py-3" href="/patterns">Patterns</a>
          <a className="cta-secondary rounded-xl px-6 py-3" href="https://github.com/gr8monk3ys/ui">GitHub</a>
        </div>
      </Section>

      <Section id="colors" topDivider>
        <SectionHeader index="01" eyebrow="TOKENS" title="Colors"
          description="Warm-paper light, slate-night dark, forest-green primary. hsl custom properties." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COLOR_TOKENS.map((token) => (
            <div key={token} className="surface rounded-xl p-3">
              <div
                className="h-14 w-full rounded-lg border"
                style={{ background: `hsl(var(--${token}))` }}
              />
              <p className="label-mono mt-2">--{token}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="typography" topDivider>
        <SectionHeader index="02" eyebrow="TOKENS" title="Typography"
          description="Fraunces display, Instrument Sans body, IBM Plex Mono wall labels. Fluid clamp() scale." />
        <div className="space-y-6">
          {TYPE_SCALE.map(({ cls, label }) => (
            <div key={cls}>
              <p className="label-mono mb-1">{label}</p>
              <p className={cls}>The quick brown fox</p>
            </div>
          ))}
          <div>
            <p className="label-mono mb-1">label-mono</p>
            <p className="label-mono">CATALOGUE NO. 004 — EST. 2026</p>
          </div>
        </div>
      </Section>

      <Section id="components" topDivider>
        <SectionHeader index="03" eyebrow="REGISTRY" title="Components" />
        <div className="space-y-10">
          <div>
            <p className="label-mono mb-3">BUTTON</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Default</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
          <div>
            <p className="label-mono mb-3">BADGE</p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>
          <div>
            <p className="label-mono mb-3">CARD</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Editorial Card</CardTitle>
                  <CardDescription>Hairline border, hover lift, no chrome.</CardDescription>
                </CardHeader>
                <CardContent className="text-body-sm">
                  Content on open paper, divided by space and thin lines.
                </CardContent>
              </Card>
              <div className="surface-recessed rounded-2xl card-padding-sm">
                <p className="label-mono mb-2">SURFACE-RECESSED</p>
                <p className="text-body-sm">Tinted paper, not an inset shadow.</p>
              </div>
            </div>
          </div>
          <div>
            <p className="label-mono mb-3">ACCORDION + AVATAR</p>
            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="a">
                  <AccordionTrigger>What is this?</AccordionTrigger>
                  <AccordionContent>A reusable identity, one shadcn add away.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                  <AccordionTrigger>What can I change?</AccordionTrigger>
                  <AccordionContent>--primary and --radius. Nothing else.</AccordionContent>
                </AccordionItem>
              </Accordion>
              <Avatar>
                <AvatarFallback>LS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}

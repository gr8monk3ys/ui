"use client";

import { ChevronsUpDown } from "lucide-react";

import { DemoBlock } from "@/components/gallery/demo-block";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Section, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";

export function LayoutDemos() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <DemoBlock label="COLLAPSIBLE" items={["collapsible"]}>
        <Collapsible className="max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-label">Three more essays</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon-sm"><ChevronsUpDown /></Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="text-description-sm grid gap-2 pt-2">
            <p className="surface rounded-xl px-3 py-2">On warm paper</p>
            <p className="surface rounded-xl px-3 py-2">Against card chrome</p>
            <p className="surface rounded-xl px-3 py-2">The two-knob rule</p>
          </CollapsibleContent>
        </Collapsible>
      </DemoBlock>

      <DemoBlock label="SEPARATOR" items={["separator"]}>
        <div className="max-w-sm text-sm">
          <p>Warm paper</p>
          <Separator className="my-3" />
          <div className="flex h-5 items-center gap-3">
            <span>Essays</span>
            <Separator orientation="vertical" />
            <span>Photos</span>
            <Separator orientation="vertical" />
            <span>Code</span>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock label="RESIZABLE" items={["resizable"]}>
        <ResizablePanelGroup orientation="horizontal" className="min-h-[140px] max-w-md rounded-2xl border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center"><span className="label-mono">ONE</span></div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center"><span className="label-mono">TWO</span></div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DemoBlock>

      <DemoBlock label="SCROLL-AREA" items={["scroll-area"]}>
        <ScrollArea className="h-40 max-w-sm rounded-xl border p-3">
          <div className="grid gap-2 text-sm">
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="border-b pb-2 last:border-0">
                <span className="label-mono mr-2">NO. {String(i + 1).padStart(3, "0")}</span>
                Catalogue entry
              </p>
            ))}
          </div>
        </ScrollArea>
      </DemoBlock>

      <DemoBlock label="ACCORDION" items={["accordion"]}>
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
      </DemoBlock>

      <DemoBlock label="SECTION + SECTIONHEADER" items={["section"]}>
        <Section size="full" padding="none" className="px-0">
          <SectionHeader index="00" eyebrow="EXAMPLE" title="A gallery placard"
            description="Mono kicker, Fraunces title, hairline rule. Every page on this site is built out of it." />
        </Section>
      </DemoBlock>
    </div>
  );
}

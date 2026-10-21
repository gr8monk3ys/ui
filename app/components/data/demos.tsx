"use client";

import { BookOpen, Camera, FileText, Inbox } from "lucide-react";
import dynamic from "next/dynamic";

import { DemoBlock } from "@/components/gallery/demo-block";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// recharts is the heaviest dependency in the gallery; load it on demand
// (react-best-practices bundle-dynamic-imports). The placeholder keeps the
// chart's height so nothing shifts when it arrives.
const ChartDemo = dynamic(() => import("./chart-demo"), {
  ssr: false,
  loading: () => <div className="h-56 w-full" aria-hidden="true" />,
});

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const INVOICES = [
  { no: "NO. 001", what: "Warm paper", amount: 120 },
  { no: "NO. 002", what: "Forest green", amount: 85 },
  { no: "NO. 003", what: "Hairline rules", amount: 42 },
];

export function DataDemos() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <DemoBlock label="TABLE" items={["table"]}>
        <Table>
          <TableCaption className="label-mono">CATALOGUE — Q2 2026</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((r) => (
              <TableRow key={r.no}>
                <TableCell className="font-mono text-xs">{r.no}</TableCell>
                <TableCell>{r.what}</TableCell>
                <TableCell className="text-right">{USD.format(r.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DemoBlock>

      <DemoBlock label="CHART (recharts)" items={["chart"]}>
        <ChartDemo />
      </DemoBlock>

      <DemoBlock label="CAROUSEL" items={["carousel"]}>
        <Carousel className="mx-12">
          <CarouselContent>
            {["Paper", "Green", "Mono"].map((t) => (
              <CarouselItem key={t}>
                <div className="surface-card flex h-32 items-center justify-center rounded-2xl">
                  <span className="text-card-title">{t}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DemoBlock>

      <DemoBlock label="ASPECT-RATIO (16/9)" items={["aspect-ratio"]}>
        <AspectRatio ratio={16 / 9}>
          <div className="surface-recessed flex h-full w-full items-center justify-center rounded-2xl">
            <Camera className="text-muted-foreground h-6 w-6" />
          </div>
        </AspectRatio>
      </DemoBlock>

      <DemoBlock label="ITEM" items={["item"]}>
        <Item variant="outline">
          <ItemMedia variant="icon"><FileText /></ItemMedia>
          <ItemContent>
            <ItemTitle>On Warm Paper</ItemTitle>
            <ItemDescription>An essay about backgrounds that are not white.</ItemDescription>
          </ItemContent>
          <ItemActions><Button variant="outline" size="sm">Read</Button></ItemActions>
        </Item>
      </DemoBlock>

      <DemoBlock label="KBD" items={["kbd"]}>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </DemoBlock>

      <DemoBlock label="MARKER" items={["marker"]}>
        <div className="flex items-center gap-4">
          <Marker><MarkerIcon><BookOpen /></MarkerIcon><MarkerContent>Reading</MarkerContent></Marker>
          <Marker variant="border"><MarkerContent>2026</MarkerContent></Marker>
        </div>
      </DemoBlock>

      <DemoBlock label="EMPTY" items={["empty"]}>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
            <EmptyTitle>Nothing Filed Yet</EmptyTitle>
            <EmptyDescription>The catalogue drawer is open and waiting.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </DemoBlock>

      <DemoBlock label="CARD" items={["card"]}>
        <Card>
          <CardHeader>
            <CardTitle>Editorial Card</CardTitle>
            <CardDescription>Hairline border, hover lift, no chrome.</CardDescription>
          </CardHeader>
          <CardContent className="text-body-sm">
            Content on open paper, divided by space and thin lines.
          </CardContent>
        </Card>
      </DemoBlock>

      <DemoBlock label="BADGE" items={["badge"]}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </DemoBlock>

      <DemoBlock label="AVATAR" items={["avatar"]}>
        <div className="flex items-center gap-3">
          <Avatar><AvatarFallback>LS</AvatarFallback></Avatar>
          <Avatar><AvatarFallback>UI</AvatarFallback></Avatar>
        </div>
      </DemoBlock>
    </div>
  );
}

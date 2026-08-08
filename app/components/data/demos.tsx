"use client";

import { BookOpen, Camera, FileText, Inbox } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { DemoBlock } from "@/components/gallery/demo-block";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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

const chartData = [
  { month: "Jan", views: 186 }, { month: "Feb", views: 305 }, { month: "Mar", views: 237 },
  { month: "Apr", views: 273 }, { month: "May", views: 209 }, { month: "Jun", views: 214 },
];
const chartConfig = { views: { label: "Views", color: "hsl(var(--primary))" } } satisfies ChartConfig;

const INVOICES = [
  { no: "NO. 001", what: "Warm paper", amount: "$120.00" },
  { no: "NO. 002", what: "Forest green", amount: "$85.00" },
  { no: "NO. 003", what: "Hairline rules", amount: "$42.00" },
];

export function DataDemos() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <DemoBlock label="TABLE">
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
                <TableCell className="text-right">{r.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DemoBlock>

      <DemoBlock label="CHART (recharts)">
        <ChartContainer config={chartConfig} className="h-56 w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="views" fill="var(--color-views)" radius={6} />
          </BarChart>
        </ChartContainer>
      </DemoBlock>

      <DemoBlock label="CAROUSEL">
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

      <DemoBlock label="ASPECT-RATIO (16/9)">
        <AspectRatio ratio={16 / 9}>
          <div className="surface-recessed flex h-full w-full items-center justify-center rounded-2xl">
            <Camera className="text-muted-foreground h-6 w-6" />
          </div>
        </AspectRatio>
      </DemoBlock>

      <DemoBlock label="ITEM">
        <Item variant="outline">
          <ItemMedia variant="icon"><FileText /></ItemMedia>
          <ItemContent>
            <ItemTitle>On warm paper</ItemTitle>
            <ItemDescription>An essay about backgrounds that are not white.</ItemDescription>
          </ItemContent>
          <ItemActions><Button variant="outline" size="sm">Read</Button></ItemActions>
        </Item>
      </DemoBlock>

      <DemoBlock label="KBD">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </DemoBlock>

      <DemoBlock label="MARKER">
        <div className="flex items-center gap-4">
          <Marker><MarkerIcon><BookOpen /></MarkerIcon><MarkerContent>Reading</MarkerContent></Marker>
          <Marker variant="border"><MarkerContent>2026</MarkerContent></Marker>
        </div>
      </DemoBlock>

      <DemoBlock label="EMPTY">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
            <EmptyTitle>Nothing filed yet</EmptyTitle>
            <EmptyDescription>The catalogue drawer is open and waiting.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </DemoBlock>
    </div>
  );
}

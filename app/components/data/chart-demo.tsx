"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", views: 186 }, { month: "Feb", views: 305 }, { month: "Mar", views: 237 },
  { month: "Apr", views: 273 }, { month: "May", views: 209 }, { month: "Jun", views: 214 },
];
const chartConfig = { views: { label: "Views", color: "hsl(var(--primary))" } } satisfies ChartConfig;

/** The recharts demo, split out so recharts loads only when this renders. */
export default function ChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <BarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="views" fill="var(--color-views)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}

"use client";

import { BreadcrumbNav } from "@/components/patterns/breadcrumb-nav";
import { DemoBlock } from "@/components/gallery/demo-block";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DirectionProvider } from "@/components/ui/direction";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function NavigationDemos() {
  return (
    <div className="grid gap-8">
      <DemoBlock label="BREADCRUMB (composable)" items={["breadcrumb"]}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/components">Components</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Navigation</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DemoBlock>

      <DemoBlock label="TABS" items={["tabs"]}>
        <Tabs defaultValue="essays" className="max-w-md">
          <TabsList>
            <TabsTrigger value="essays">Essays</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="essays" className="text-body-sm pt-3">Long-form writing on paper.</TabsContent>
          <TabsContent value="photos" className="text-body-sm pt-3">Film scans, mostly.</TabsContent>
          <TabsContent value="code" className="text-body-sm pt-3">The registry you are looking at.</TabsContent>
        </Tabs>
      </DemoBlock>

      <DemoBlock label="NAVIGATION-MENU" items={["navigation-menu"]}>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Catalog</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-64 gap-1 p-2">
                  <NavigationMenuLink href="/components/forms">Forms & inputs</NavigationMenuLink>
                  <NavigationMenuLink href="/components/overlays">Overlays</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </DemoBlock>

      <DemoBlock label="PAGINATION" items={["pagination"]}>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </DemoBlock>

      <DemoBlock label="SIDEBAR (embedded demo)" items={["sidebar"]}>
        <SidebarProvider className="min-h-[320px] overflow-hidden rounded-2xl border">
          <Sidebar collapsible="none">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Catalogue</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {["Colors", "Typography", "Components"].map((t) => (
                      <SidebarMenuItem key={t}><SidebarMenuButton>{t}</SidebarMenuButton></SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="text-description flex-1 p-6">Content beside the sidebar.</main>
        </SidebarProvider>
      </DemoBlock>

      <DemoBlock label="DIRECTION (RTL)" items={["direction"]}>
        <DirectionProvider dir="rtl">
          <Tabs defaultValue="a" className="max-w-md" dir="rtl">
            <TabsList>
              <TabsTrigger value="a">اليمين</TabsTrigger>
              <TabsTrigger value="b">اليسار</TabsTrigger>
            </TabsList>
            <TabsContent value="a" className="text-body-sm pt-3">Layout flips right-to-left.</TabsContent>
            <TabsContent value="b" className="text-body-sm pt-3">Second panel.</TabsContent>
          </Tabs>
        </DirectionProvider>
      </DemoBlock>

      <DemoBlock label="BREADCRUMB-NAV (derived from the route)" items={["breadcrumb-nav"]}>
        <BreadcrumbNav />
      </DemoBlock>
    </div>
  );
}

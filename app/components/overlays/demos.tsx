"use client";

import { toast } from "sonner";

import { DemoBlock } from "@/components/gallery/demo-block";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function OverlaysDemos() {
  return (
    <>
      <Toaster />
      <div className="grid gap-8 lg:grid-cols-2">
        <DemoBlock label="DIALOG" items={["dialog"]}>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Wall label</DialogTitle>
                <DialogDescription>Frosted paper over the gallery floor.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </DemoBlock>

        <DemoBlock label="ALERT-DIALOG" items={["alert-dialog"]}>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="destructive">Delete draft</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
                <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep it</AlertDialogCancel>
                <AlertDialogAction>Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DemoBlock>

        <DemoBlock label="SHEET" items={["sheet"]}>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline">Open sheet</Button></SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Side panel</SheetTitle>
                <SheetDescription>Slides in from the edge on frosted paper.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </DemoBlock>

        <DemoBlock label="DRAWER" items={["drawer"]}>
          <Drawer>
            <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Bottom drawer</DrawerTitle>
                <DrawerDescription>For mobile-first flows.</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </DemoBlock>

        <DemoBlock label="POPOVER" items={["popover"]}>
          <Popover>
            <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
            <PopoverContent className="text-body-sm">Anchored floating panel with a hairline border.</PopoverContent>
          </Popover>
        </DemoBlock>

        <DemoBlock label="HOVER-CARD" items={["hover-card"]}>
          <HoverCard>
            <HoverCardTrigger asChild><Button variant="link">@gr8monk3ys</Button></HoverCardTrigger>
            <HoverCardContent className="text-body-sm">Builds identities and the tools that wear them.</HoverCardContent>
          </HoverCard>
        </DemoBlock>

        <DemoBlock label="DROPDOWN-MENU" items={["dropdown-menu"]}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline">Actions</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Draft</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuItem>Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DemoBlock>

        <DemoBlock label="CONTEXT-MENU (right-click)" items={["context-menu"]}>
          <ContextMenu>
            <ContextMenuTrigger className="surface-recessed block rounded-2xl p-8 text-center text-description-sm">
              Right-click this paper
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Rename</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </DemoBlock>

        <DemoBlock label="MENUBAR" items={["menubar"]}>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New essay</MenubarItem>
                <MenubarItem>Export</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Zoom in</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </DemoBlock>

        <DemoBlock label="TOOLTIP" items={["tooltip"]}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
              <TooltipContent>A small caption beside the work.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DemoBlock>

        <DemoBlock label="COMMAND" items={["command"]}>
          <Command className="max-w-sm rounded-xl border">
            <CommandInput placeholder="Type a command…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Open gallery <CommandShortcut>⌘G</CommandShortcut></CommandItem>
                <CommandItem>Toggle theme <CommandShortcut>⌘T</CommandShortcut></CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DemoBlock>

        <DemoBlock label="SONNER (toasts)" items={["sonner"]}>
          <Button variant="outline" onClick={() => toast("Saved to the catalogue.", { description: "NO. 004 — filed under identity." })}>
            Show toast
          </Button>
        </DemoBlock>
      </div>
    </>
  );
}

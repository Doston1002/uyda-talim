"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeftIcon } from "lucide-react";

import { useIsMobile } from "./use-mobile";
import { cn } from "./utils";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/* ---------------- TYPES ---------------- */

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type SidebarState = "expanded" | "collapsed";

type SidebarContextProps = {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

/* ---------------- CONTEXT ---------------- */

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

/* ---------------- PROVIDER ---------------- */

type SidebarProviderProps = React.ComponentPropsWithoutRef<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);

  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value: boolean | ((v: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value;

      if (onOpenChange) onOpenChange(next);
      else _setOpen(next);

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [open, onOpenChange]
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((v) => !v);
    else setOpen((v) => !v);
  }, [isMobile, setOpen]);

  /* 🔥 FIX: explicit type (THIS FIXES YOUR ERROR) */
  const state: SidebarState = open ? "expanded" : "collapsed";

  const value = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [state, open, openMobile, isMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": "16rem",
            } as React.CSSProperties
          }
          className={cn("flex min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

/* ---------------- SIDEBAR ---------------- */

type SidebarProps = React.ComponentPropsWithoutRef<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

function Sidebar({
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent className="w-[18rem] p-0 bg-sidebar">
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Mobile sidebar</SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      data-slot="sidebar"
      className={cn("hidden md:flex w-64 bg-sidebar", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ---------------- TRIGGER ---------------- */

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
    </Button>
  );
}

/* ---------------- SIMPLE UI PARTS ---------------- */

function SidebarHeader(props: React.ComponentPropsWithoutRef<"div">) {
  return <div className="p-2" {...props} />;
}

function SidebarFooter(props: React.ComponentPropsWithoutRef<"div">) {
  return <div className="p-2 mt-auto" {...props} />;
}

function SidebarContent(props: React.ComponentPropsWithoutRef<"div">) {
  return <div className="flex-1 overflow-auto p-2" {...props} />;
}

function SidebarGroup(props: React.ComponentPropsWithoutRef<"div">) {
  return <div className="p-2" {...props} />;
}

/* ---------------- LABEL (SAFE SLOT) ---------------- */

function SidebarGroupLabel({
  asChild,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { asChild?: boolean }) {
  const Comp: any = asChild ? Slot : "div";

  return (
    <Comp
      data-sidebar="group-label"
      className="text-xs font-medium px-2 h-8 flex items-center"
      {...props}
    />
  );
}

/* ---------------- EXPORTS ---------------- */

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
};
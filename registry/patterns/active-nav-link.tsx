"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isPathActive } from "@/lib/navigation-path";
import { cn } from "@/lib/utils";

interface ActiveNavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

/** Nav link with the slide-in underline; underline sticks when active. */
export function ActiveNavLink({
  href,
  children,
  className,
  activeClassName,
  inactiveClassName,
}: ActiveNavLinkProps) {
  const pathname = usePathname();
  const active = isPathActive(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "nav-underline",
        active && "nav-underline-active",
        className,
        active ? activeClassName : inactiveClassName,
      )}
    >
      {children}
    </Link>
  );
}

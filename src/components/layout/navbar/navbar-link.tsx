"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export type NavbarLinkProps = PropsWithChildren<{
  href: string;
  className?: string;
}>;

export const NavbarLink = ({ href, children, className }: NavbarLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-foreground text-foreground/80",
        pathname === href && "text-foreground font-semibold",
        className
      )}
    >
      {children}
    </Link>
  );
};

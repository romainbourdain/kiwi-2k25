import { UserButton } from "@/features/auth/user-button";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Badge } from "../../ui/badge";
import { NavbarLink } from "./navbar-link";

export type Navbar = {
  variant: "admin" | "consumer" | "full-page";
};

export const Navbar = ({ variant }: Navbar) => {
  const urlPrefix = variant === "admin" ? "/admin" : "";
  return (
    <header
      className={cn(
        "sticky top-0 flex items-center justify-between bg-background/95 px-5 py-2 backdrop-blur border-b z-50",
        variant === "full-page" && "bg-transparent border-none"
      )}
    >
      <nav className="flex justify-between container items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/logo.svg"
              alt="kiwi logo"
              width={150}
              height={150}
              className={cn("size-10 invert dark:invert-0")}
            />
          </Link>
          {variant === "admin" && <Badge>Admin</Badge>}
          <div className="flex items-center gap-4 text-sm">
            <NavbarLink href={`${urlPrefix}/courses`}>Cours</NavbarLink>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Suspense>
            <UserButton />
          </Suspense>
        </div>
      </nav>
    </header>
  );
};

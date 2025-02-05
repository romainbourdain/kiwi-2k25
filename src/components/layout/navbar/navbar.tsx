import { UserButton } from "@/features/auth/auth-components/user-button";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Badge } from "../../ui/badge";
import { NavbarLink } from "./navbar-link";

export type Navbar = {
  variant: "admin" | "consumer";
};

export const Navbar = ({ variant }: Navbar) => {
  const urlPrefix = variant === "admin" ? "/admin" : "";
  return (
    <header className="sticky top-0 flex items-center justify-between bg-background/95 px-5 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="flex justify-between container items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/logo.svg"
              alt="kiwi logo"
              width={150}
              height={150}
              className="size-10 invert dark:invert-0"
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

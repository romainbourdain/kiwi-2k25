import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "../../../actions/user.action";
import { SignInButton } from "./sign-in-button";

export const UserButton = async () => {
  const user = await getCurrentUser();

  if (!user) return <SignInButton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer">
          <AvatarImage src={user.image || ""} alt={`${user.name} avatar`} />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {hasPermission(user, "admin", "view") && (
          <Link href="/admin">
            <DropdownMenuItem>
              <ShieldCheck />
              Admin
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem
          onClick={async () => {
            "use server";
            await signOut();
          }}
        >
          <LogOut />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

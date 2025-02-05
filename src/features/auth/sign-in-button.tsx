import { Button, buttonVariants } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Github, LogIn } from "lucide-react";
import Link from "next/link";

export const SignInButton = () => {
  return (
    <Link
      href="/auth/sign-in"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "flex items-center gap-2"
      )}
    >
      <LogIn />
      Connexion
    </Link>
  );
};

export const GithubButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/" });
      }}
    >
      <Button type="submit" variant="outline" className="w-full">
        <Github />
        Continuer avec Github
      </Button>
    </form>
  );
};

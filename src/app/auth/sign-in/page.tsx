import { CenteredPage } from "@/components/layout/page/centered-page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubButton } from "@/features/auth/auth-components/sign-in-button";
import type { PageParams } from "@/types/next";

export default async function SignInPage({}: PageParams) {
  return (
    <CenteredPage>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Se connecter</CardTitle>
          <CardDescription>
            Connectez vous pour accéder aux différents cours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <GithubButton />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Ou continuer avec
            </span>
          </div>
          <form className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </CenteredPage>
  );
}

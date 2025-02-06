import { Navbar } from "@/components/layout/navbar/navbar";
import { CenteredPage } from "@/components/layout/page/centered-page";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fingerprint } from "lucide-react";
import Link from "next/link";

export default async function Unauthorized() {
  return (
    <div className="bg-[url(/icons/background-light.svg)] dark:bg-[url(/icons/background-dark.svg)] bg-cover bg-no-repeat size-full flex-1 flex flex-col">
      <Navbar variant="full-page" />
      <CenteredPage>
        <Card className="max-w-screen-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Fingerprint className="text-destructive size-7" /> 401 - Non
              autorisé
            </CardTitle>
            <CardDescription>
              Vous ne pouvez pas accéder à cette page. Si vous pensez qu&apos;il
              s&apos;agit d&apos;une erreur, contactez un administrateur.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href="/"
              className={buttonVariants({ variant: "destructiveOutline" })}
            >
              Retour à l&apos;accueil
            </Link>
          </CardFooter>
        </Card>
      </CenteredPage>
    </div>
  );
}

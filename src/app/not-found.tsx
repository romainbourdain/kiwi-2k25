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
import { Binoculars } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  return (
    <>
      <Navbar variant="consumer" />
      <CenteredPage>
        <Card className="max-w-screen-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Binoculars className="text-destructive size-7" /> 404 - Page
              introuvable
            </CardTitle>
            <CardDescription>
              La page que vous souhaitez charger n&apos;existe pas. Si vous
              pensez qu&apos;il s&apos;agit d&apos;une erreur, contactez un
              administrateur.
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
    </>
  );
}

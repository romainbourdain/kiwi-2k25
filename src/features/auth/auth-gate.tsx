import { Spinner } from "@/components/icons/spinner";
import { CenteredPage } from "@/components/layout/page/centered-page";
import { hasPermission, Permissions } from "@/lib/permissions";
import { redirect, unauthorized } from "next/navigation";
import { PropsWithChildren, Suspense } from "react";
import { getCurrentUser } from "../../actions/user.action";

export type RequireAuthProps = PropsWithChildren<{
  resource?: keyof Permissions;
  requireAuth?: boolean;
  redirectTo?: string;
}>;

export const AuthGate = async ({ ...props }: RequireAuthProps) => {
  return (
    <Suspense
      fallback={
        <CenteredPage>
          <Spinner className="size-10" />
        </CenteredPage>
      }
    >
      <AuthCheck {...props} />
    </Suspense>
  );
};

export const AuthCheck = async ({
  resource,
  redirectTo,
  requireAuth = true,
  children,
}: RequireAuthProps) => {
  const user = await getCurrentUser();

  if (!requireAuth && user) {
    if (redirectTo) redirect(redirectTo);
    else return unauthorized();
  }

  const hasNoAccess =
    !user || (resource && !hasPermission(user, resource, "view"));

  if (requireAuth && hasNoAccess) {
    if (redirectTo) redirect(redirectTo);
    else return unauthorized();
  }

  return <>{children}</>;
};

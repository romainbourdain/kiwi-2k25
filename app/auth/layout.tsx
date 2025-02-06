import { Navbar } from "@/components/layout/navbar/navbar";
import { AuthGate } from "@/features/auth/auth-gate";
import type { LayoutParams } from "@/types/next";

export default async function AuthLayout({ children }: LayoutParams) {
  return (
    <AuthGate redirectTo="/" requireAuth={false}>
      <div className="bg-[url(/icons/background-light.svg)] dark:bg-[url(/icons/background-dark.svg)] bg-cover bg-no-repeat size-full flex-1 flex flex-col">
        <Navbar variant="full-page" />
        {children}
      </div>
    </AuthGate>
  );
}

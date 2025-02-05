import { Navbar } from "@/components/layout/navbar/navbar";
import { AuthGate } from "@/features/auth/auth-gate";
import type { LayoutParams } from "@/types/next";

export default async function AuthLayout({ children }: LayoutParams) {
  return (
    <AuthGate redirectTo="/" requireAuth={false}>
      <Navbar variant="consumer" />
      {children}
    </AuthGate>
  );
}

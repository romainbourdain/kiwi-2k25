import { Navbar } from "@/components/layout/navbar/navbar";
import { AuthGate } from "@/features/auth/auth-gate";
import type { LayoutParams } from "@/types/next";

export default async function AdminLayout({ children }: LayoutParams) {
  return (
    <>
      <Navbar variant="admin" />
      <AuthGate resource="admin">{children}</AuthGate>
    </>
  );
}

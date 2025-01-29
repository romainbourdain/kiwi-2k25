import type { LayoutParams } from "@/types/next";

export default async function RouteLayout({ children }: LayoutParams) {
  return <>{children}</>;
}

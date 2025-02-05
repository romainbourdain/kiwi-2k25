import { Navbar } from "@/components/layout/navbar/navbar";
import type { LayoutParams } from "@/types/next";

export default async function ConsumerLayout({ children }: LayoutParams) {
  return (
    <>
      <Navbar variant="consumer" />
      {children}
    </>
  );
}

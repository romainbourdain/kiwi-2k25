import { Provider } from "@/components/provider";
import { cn } from "@/lib/utils";
import "@/style/globals.css";
import type { Metadata } from "next";
import { geistMono, geistSans } from "./fonts";

export const metadata: Metadata = {
  title: "Kiwi",
  description: "Learn faster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

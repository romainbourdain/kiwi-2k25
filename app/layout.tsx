import { Provider } from "@/components/utilities/provider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { LayoutParams } from "@/types/next";
import type { Metadata } from "next";
import { geistMono, geistSans } from "./fonts";

export const metadata: Metadata = {
  title: "Kiwi",
  description: "Learn faster",
};

export default async function RootLayout({ children }: LayoutParams) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <Provider>
          <div className="min-h-screen flex flex-col">{children}</div>
        </Provider>
      </body>
    </html>
  );
}

"use client";

import { ThemeProvider } from "@/features/theme/theme-provider";
import type { PropsWithChildren } from "react";
import { Toaster } from "../ui/sonner";

export type ProviderProps = PropsWithChildren<{}>;

export const Provider = ({ children }: ProviderProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      {children}
    </ThemeProvider>
  );
};

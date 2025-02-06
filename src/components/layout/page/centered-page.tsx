import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export type CenteredPageProps = PropsWithChildren<{ className?: string }>;

export const CenteredPage = ({ children, className }: CenteredPageProps) => {
  return (
    <div
      className={cn(
        "flex-1 size-full flex items-center justify-center p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

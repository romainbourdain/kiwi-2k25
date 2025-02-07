import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export type PageHeaderProps = PropsWithChildren<{
  title: string;
  className?: string;
}>;

export const PageHeader = ({ title, children, className }: PageHeaderProps) => {
  return (
    <div
      className={cn("mb-8 flex gap-4 items-center justify-between", className)}
    >
      <h1 className="text-4xl font-semibold">{title}</h1>
      {children && <div>{children}</div>}
    </div>
  );
};

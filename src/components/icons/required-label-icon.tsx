import { cn } from "@/lib/utils";
import { AsteriskIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

export type RequiredLabelIconProps = ComponentPropsWithoutRef<
  typeof AsteriskIcon
>;

export const RequiredLabelIcon = ({
  className,
  ...props
}: RequiredLabelIconProps) => {
  return (
    <AsteriskIcon
      {...props}
      className={cn("text-destructive inline size-4 align-top", className)}
    />
  );
};

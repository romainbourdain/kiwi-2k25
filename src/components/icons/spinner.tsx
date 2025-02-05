import { cn } from "@/lib/utils";
import { Loader2, LucideProps } from "lucide-react";

export type SpinnerProps = LucideProps;

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  return <Loader2 {...props} className={cn("animate-spin", className)} />;
};

import type { PropsWithChildren } from "react";

export type CenteredPageProps = PropsWithChildren<{}>;

export const CenteredPage = ({ children }: CenteredPageProps) => {
  return (
    <div className="flex-1 size-full flex items-center justify-center p-4">
      {children}
    </div>
  );
};

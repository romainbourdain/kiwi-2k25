import type { PropsWithChildren } from "react";

export type ProviderProps = PropsWithChildren<{}>;

export const Provider = ({ children }: ProviderProps) => {
  return <>{children}</>;
};

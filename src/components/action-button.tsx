"use client";

import { cn } from "@/lib/utils";
import { SafeActionFn } from "next-safe-action";
import { ComponentPropsWithRef, PropsWithChildren, useTransition } from "react";
import { Spinner } from "./icons/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export type ActionButtonProps = Omit<
  ComponentPropsWithRef<typeof Button>,
  "onClick"
> & {
  action: () => SafeActionFn;
  requireAreYouSure?: boolean;
};

export const ActionButton = ({
  action,
  requireAreYouSure = false,
  disabled,
  children,
  ...props
}: ActionButtonProps) => {
  const [isLoading, startTransition] = useTransition();

  const performAction = () => {
    startTransition(async () => {
      const data = await action();

      // actionToast({ actionData: data });
    });
  };

  if (requireAreYouSure) {
    return (
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props} disabled={isLoading || disabled}>
            <LoadingTextSwap isLoading={isLoading}>{children}</LoadingTextSwap>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir continuer ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={performAction}>
              <LoadingTextSwap isLoading={isLoading}>Continuer</LoadingTextSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button {...props} disabled={isLoading || disabled} onClick={performAction}>
      <LoadingTextSwap isLoading={isLoading}>{children}</LoadingTextSwap>
    </Button>
  );
};

export type LoadingTextSwapProps = PropsWithChildren<{
  isLoading: boolean;
}>;

export const LoadingTextSwap = ({
  children,
  isLoading,
}: LoadingTextSwapProps) => {
  return (
    <div className="grid items-center justify-items-center">
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2",
          isLoading ? "invisible" : "visible"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2 text-center",
          isLoading ? "visible" : "invisible"
        )}
      >
        <Spinner />
      </div>
    </div>
  );
};

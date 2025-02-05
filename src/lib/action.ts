import { getCurrentUser } from "@/actions/user.action";
import { createSafeActionClient } from "next-safe-action";
import { toast, ToastT } from "sonner";

class ActionError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const errorHandler = (error: Error) => {
  if (error instanceof ActionError) {
    return { error: true, code: error.code, message: error.message };
  }

  return {
    error: true,
    code: "UNKNOWN_ERROR",
    message: "Une erreur est survenue",
  };
};

export const actionClient = createSafeActionClient({
  handleServerError: errorHandler,
}).use(async ({ next }) => {
  const user = await getCurrentUser();
  if (!user)
    throw new ActionError("NOT_AUTHENTICATED", "Vous devez être connecté");
  return next({ ctx: { user } });
});

export const actionToast = ({
  actionData,
  ...props
}: Omit<Partial<ToastT>, "description"> & {
  actionData: { error: boolean; message: string };
}) => {
  const toastFn = actionData.error ? toast.error : toast.success;

  return toastFn(actionData.error ? "Erreur" : "Succès", {
    description: actionData.message,
    ...props,
  });
};

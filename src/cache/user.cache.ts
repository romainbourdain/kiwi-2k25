import { getGlobalTag, getIdTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getUserGlobalTag = () => {
  return getGlobalTag("users");
};

export const getUserIdTag = (id: string) => {
  return getIdTag("users", id);
};

export const getCurrentUserTag = () => {
  return getIdTag("users", "current");
};

export const revalidateUserCache = (id: string) => {
  revalidateTag(getUserGlobalTag());
  revalidateTag(getUserIdTag(id));
};

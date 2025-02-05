"use server";

import { getUserGlobalTag, getUserIdTag } from "@/cache/user.cache";
import { auth } from "@/lib/auth";
import { findAllUsersQuery, findUserByIdQuery } from "@/services/user.service";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getCurrentUser = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;

  const user = await findUserByIdQuery(session.user.id);

  return user;
};

export const getAllUsers = async () => {
  "use cache";
  cacheTag(getUserGlobalTag());

  return await findAllUsersQuery();
};

export const getUserById = async (id: string) => {
  "use cache";
  cacheTag(getUserIdTag(id));

  return await findUserByIdQuery(id);
};

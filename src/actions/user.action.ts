"use server";

import { getUserGlobalTag, getUserIdTag } from "@/cache/user.cache";
import { auth } from "@/lib/auth";
import { findAllUsersQuery, findUserByIdQuery } from "@/services/user.service";
import { User } from "@prisma/client";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getCurrentUser = async () => {
  const session = await auth();
  return (session?.user as User | null) ?? null;
};

export const getAllUsers = async () => {
  "use cache";
  cacheTag(getUserGlobalTag());

  findAllUsersQuery();
};

export const getUserById = async (id: string) => {
  "use cache";
  cacheTag(getUserIdTag(id));

  findUserByIdQuery(id);
};

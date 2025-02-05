import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const findAllUsersQuery = async (options?: Prisma.UserFindManyArgs) => {
  return await db.user.findMany(options);
};

export const findUserByIdQuery = async (
  id: string,
  options?: Prisma.UserFindUniqueArgs
) => {
  return await db.user.findUnique({
    where: { id },
    ...options,
  });
};

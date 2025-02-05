import { revalidateSectionCache } from "@/cache/section.cache";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const createSectionQuery = async (
  courseId: string,
  data: Omit<Prisma.CourseSectionCreateInput, "order" | "course">
) => {
  const section = await db.$transaction(async (db) => {
    const maxOrder = await getSectionOrderQuery(courseId);
    const section = await db.courseSection.create({
      data: {
        courseId,
        order: maxOrder + 1,
        ...data,
      },
    });

    return section;
  });

  revalidateSectionCache(section.courseId, section.id);
  return section;
};

export const updateSectionQuery = async (
  id: string,
  data: Partial<Prisma.CourseSectionCreateInput>
) => {
  const section = await db.courseSection.update({
    where: { id },
    data,
  });

  revalidateSectionCache(section.courseId, section.id);
  return section;
};

export const deleteSectionQuery = async (id: string) => {
  const section = await db.courseSection.delete({
    where: { id },
  });

  revalidateSectionCache(section.courseId, section.id);
  return section;
};

export const getSectionOrderQuery = async (courseId: string) => {
  const result = await db.courseSection.aggregate({
    where: { courseId },
    _max: {
      order: true,
    },
  });

  return result._max.order ?? 0;
};

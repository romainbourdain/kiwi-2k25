import { revalidateLessonCache } from "@/cache/lesson.cache";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

const includeCourseId = {
  section: {
    select: {
      courseId: true,
    },
  },
};

export const createLessonQuery = async (
  sectionId: string,
  data: Omit<Prisma.CourseLessonCreateInput, "order" | "section">
) => {
  const lesson = await db.$transaction(async (db) => {
    const maxOrder = await getLessonOrderQuery(sectionId);
    const lesson = await db.courseLesson.create({
      data: {
        sectionId,
        order: maxOrder + 1,
        ...data,
      },
      include: includeCourseId,
    });

    return lesson;
  });

  revalidateLessonCache(lesson.section.courseId, lesson.sectionId, lesson.id);
  return lesson;
};

export const updateLessonQuery = async (
  id: string,
  data: Partial<Prisma.CourseLessonCreateInput>
) => {
  const lesson = await db.courseLesson.update({
    where: { id },
    data,
    include: includeCourseId,
  });

  revalidateLessonCache(lesson.section.courseId, lesson.sectionId, lesson.id);
  return lesson;
};

export const deleteLessonQuery = async (id: string) => {
  const lesson = await db.courseLesson.delete({
    where: { id },
    include: includeCourseId,
  });

  revalidateLessonCache(lesson.section.courseId, lesson.sectionId, lesson.id);
  return lesson;
};

export const getLessonOrderQuery = async (sectionId: string) => {
  const result = await db.courseLesson.aggregate({
    where: { sectionId },
    _max: {
      order: true,
    },
  });

  return result._max.order ?? 0;
};

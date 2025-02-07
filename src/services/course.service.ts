import { revalidateCourseCache } from "@/cache/course.cache";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const findAllCoursesQuery = async <
  T extends Prisma.CourseFindManyArgs = {}
>(
  options?: T
): Promise<Prisma.CourseGetPayload<T>[]> => {
  const course = await db.course.findMany(options);
  return course as Prisma.CourseGetPayload<T>[];
};

export const findCourseByIdQuery = async <
  T extends Omit<Prisma.CourseFindUniqueArgs, "where">
>(
  id: string,
  options?: T
): Promise<Prisma.CourseGetPayload<T> | null> => {
  const course = await db.course.findUnique({
    where: { id },
    ...options,
  });

  return course as Prisma.CourseGetPayload<T> | null;
};

export const findCourseBySectionIdQuery = async <
  T extends Omit<Prisma.CourseFindUniqueArgs, "where">
>(
  sectionId: string,
  options?: T
): Promise<Prisma.CourseGetPayload<T> | null> => {
  const section = await db.courseSection.findUnique({
    where: { id: sectionId },
    select: {
      course: { ...options },
    },
  });

  return section?.course as Prisma.CourseGetPayload<T> | null;
};

export const findCourseByLessonIdQuery = async <
  T extends Omit<Prisma.CourseFindUniqueArgs, "where">
>(
  lessonId: string,
  options?: T
): Promise<Prisma.CourseGetPayload<T> | null> => {
  const lesson = await db.courseLesson.findUnique({
    where: { id: lessonId },
    select: {
      section: {
        select: {
          course: { ...options },
        },
      },
    },
  });

  return lesson?.section.course as Prisma.CourseGetPayload<T> | null;
};

export const createCourseQuery = async (
  authorId: string,
  data: Omit<Prisma.CourseCreateInput, "author">
) => {
  const course = await db.course.create({
    data: {
      authorId,
      ...data,
    },
  });

  revalidateCourseCache(course.id);
  return course;
};

export const updateCourseQuery = async (
  id: string,
  data: Partial<Prisma.CourseCreateInput>
) => {
  const course = await db.course.update({
    where: { id },
    data,
  });

  revalidateCourseCache(course.id);
  return course;
};

export const deleteCourseQuery = async (id: string) => {
  const course = await db.course.delete({
    where: { id },
  });

  revalidateCourseCache(course.id);
  return course;
};

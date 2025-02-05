"use server";

import { getCourseGlobalTag } from "@/cache/course.cache";
import { hasPermission } from "@/lib/permissions";
import {
  createCourseQuery,
  deleteCourseQuery,
  findAllCoursesQuery,
  updateCourseQuery,
} from "@/services/course.service";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import { CourseData, courseSchema } from "../features/courses/course.schema";
import { getCurrentUser } from "./user.action";

export const getAllCourses = async () => {
  "use cache";
  cacheTag(getCourseGlobalTag());

  const courses = await findAllCoursesQuery({
    include: {
      _count: {
        select: {
          courseSections: true,
          userAccess: true,
        },
      },
      courseSections: {
        select: {
          _count: {
            select: {
              courseLessons: true,
            },
          },
        },
      },
    },
  });

  return courses.map((course) => ({
    ...course,
    studentsCount: course._count.userAccess,
    sectionsCount: course._count.courseSections,
    lessonsCount: course.courseSections.reduce(
      (acc, section) => acc + section._count.courseLessons,
      0
    ),
  }));
};

export const createCourse = async (unsafeData: CourseData) => {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success)
    return {
      error: true,
      message: "Les données fournies ne sont pas valides",
    };

  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour créer un cours",
    };

  if (!hasPermission(user, "courses", "create"))
    return {
      error: true,
      message: "Vous n'avez pas la permission de créer un cours",
    };

  const course = await createCourseQuery(data);

  redirect(`/admin/courses/${course.id}/edit`);
};

export const updateCourse = async (id: string, unsafeData: CourseData) => {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success)
    return {
      error: true,
      message: "Les données fournies ne sont pas valides",
    };

  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour mettre à jour ce cours",
    };

  if (!hasPermission(user, "courses", "update"))
    return {
      error: true,
      message: "Vous n'avez pas la permission de mettre à jour ce cours",
    };

  await updateCourseQuery(id, data);

  return {
    error: false,
    message: "Le cours a été mis à jour avec succès",
  };
};

export const deleteCourse = async (id: string) => {
  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour supprimer un cours",
    };

  if (!hasPermission(user, "courses", "delete"))
    return {
      error: true,
      message: "Vous n'avez pas la permission de supprimer ce cours",
    };

  await deleteCourseQuery(id);

  return {
    error: false,
    message: "Le cours a été supprimé avec succès",
  };
};

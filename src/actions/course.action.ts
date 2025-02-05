"use server";

import { getCourseGlobalTag } from "@/cache/course.cache";
import { actionClient } from "@/lib/action";
import { hasPermission } from "@/lib/permissions";
import {
  createCourseQuery,
  deleteCourseQuery,
  findAllCoursesQuery,
  updateCourseQuery,
} from "@/services/course.service";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import { z } from "zod";
import { courseSchema } from "../schemas/course.schema";

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

export const createCourseAction = actionClient
  .schema(courseSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { user } = ctx;

    if (!hasPermission(user, "courses", "create"))
      throw new Error("Vous n'avez pas la permission de créer un cours");

    const course = await createCourseQuery(parsedInput);

    redirect(`/admin/courses/${course.id}/edit`);
  });

export const updateCourseAction = actionClient
  .schema(courseSchema)
  .bindArgsSchemas<[id: z.ZodString]>([z.string()])
  .action(
    async ({ ctx: { user }, parsedInput, bindArgsParsedInputs: [id] }) => {
      if (!hasPermission(user, "courses", "update"))
        throw new Error(
          "Vous n'avez pas la permission de mettre à jour ce cours"
        );

      await updateCourseQuery(id, parsedInput);
    }
  );

export const deleteCourseAction = actionClient
  .bindArgsSchemas<[id: z.ZodString]>([z.string()])
  .action(async ({ ctx: { user }, bindArgsParsedInputs: [id] }) => {
    if (!hasPermission(user, "courses", "delete"))
      throw new Error("Vous n'avez pas la permission de supprimer ce cours");

    await deleteCourseQuery(id);
  });

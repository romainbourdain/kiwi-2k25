"use server";

import { getCourseGlobalTag, getCourseIdTag } from "@/cache/course.cache";
import { actionClient } from "@/lib/action";
import { hasPermission } from "@/lib/permissions";
import {
  createCourseQuery,
  deleteCourseQuery,
  findAllCoursesQuery,
  findCourseByIdQuery,
  updateCourseQuery,
} from "@/services/course.service";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import { z } from "zod";
import { courseSchema } from "../schemas/course.schema";

export const getAllCoursesAction = actionClient.action(
  async ({ ctx: { user } }) => {
    "use cache";
    cacheTag(getCourseGlobalTag());

    if (!hasPermission(user, "courses", "view")) {
      throw new Error("Vous n'avez pas la permission de voir les cours");
    }

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
            courseLessons: {
              select: {
                _count: {
                  select: {
                    completedBy: {
                      where: {
                        userId: user.id,
                      },
                    },
                  },
                },
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
      completedLessons: course.courseSections.reduce(
        (acc, section) =>
          acc +
          section.courseLessons.reduce(
            (acc, lesson) => acc + lesson._count.completedBy,
            0
          ),
        0
      ),
      lessonsCount: course.courseSections.reduce(
        (acc, section) => acc + section._count.courseLessons,
        0
      ),
    }));
  }
);

export const getCourseByIdAction = actionClient
  .schema(z.string())
  .action(async ({ parsedInput: courseId, ctx: { user } }) => {
    "use cache";
    cacheTag(getCourseIdTag(courseId));

    if (!hasPermission(user, "courses", "view")) {
      throw new Error("Vous n'avez pas la permission de voir ce cours");
    }

    const course = await findCourseByIdQuery(courseId, {
      include: {
        author: true,
        courseSections: {
          include: {
            courseLessons: {
              include: {
                completedBy: {
                  where: {
                    userId: user.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    return course
      ? {
          ...course,
          courseSections: course.courseSections.map((section) => ({
            ...section,
            courseLessons: section.courseLessons.map((lesson) => ({
              ...lesson,
              completed: lesson.completedBy.length > 0,
            })),
          })),
        }
      : null;
  });

export const createCourseAction = actionClient
  .schema(courseSchema)
  .action(async ({ ctx: { user }, parsedInput }) => {
    if (!hasPermission(user, "courses", "create"))
      throw new Error("Vous n'avez pas la permission de créer un cours");

    const course = await createCourseQuery(user.id, parsedInput);

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

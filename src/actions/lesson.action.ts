"use server";

import { actionClient } from "@/lib/action";
import { hasPermission } from "@/lib/permissions";
import { lessonSchema } from "@/schemas/lesson.schema";
import {
  findCourseByLessonIdQuery,
  findCourseBySectionIdQuery,
} from "@/services/course.service";
import {
  createLessonQuery,
  deleteLessonQuery,
  updateLessonQuery,
} from "@/services/lesson.service";
import { z } from "zod";

export const createLessonAction = actionClient
  .schema(lessonSchema)
  .action(async ({ ctx: { user }, parsedInput }) => {
    const course = await findCourseBySectionIdQuery(parsedInput.sectionId);
    if (!course) throw new Error("Le cours n'existe pas");

    if (!hasPermission(user, "lessons", "create", course))
      throw new Error("Vous n'avez pas la permission de créer une leçon");

    await createLessonQuery(parsedInput.sectionId, parsedInput);
  });

export const updateLessonAction = actionClient
  .schema(lessonSchema)
  .bindArgsSchemas<[id: z.ZodString]>([z.string()])
  .action(
    async ({ ctx: { user }, parsedInput, bindArgsParsedInputs: [id] }) => {
      const course = await findCourseByLessonIdQuery(id);
      if (!course) throw new Error("Le cours n'existe pas");

      if (!hasPermission(user, "lessons", "update", course))
        throw new Error(
          "Vous n'avez pas la permission de mettre à jour cette leçon"
        );

      await updateLessonQuery(id, parsedInput);
    }
  );

export const deleteLessonAction = actionClient
  .bindArgsSchemas<[id: z.ZodString]>([z.string()])
  .action(async ({ ctx: { user }, bindArgsParsedInputs: [id] }) => {
    const course = await findCourseByLessonIdQuery(id);
    if (!course) throw new Error("Le cours n'existe pas");

    if (!hasPermission(user, "lessons", "delete", course))
      throw new Error("Vous n'avez pas la permission de supprimer cette leçon");

    await deleteLessonQuery(id);
  });

export const updateLessonsOrderAction = actionClient
  .schema(z.array(z.string()).nonempty())
  .action(async ({ ctx: { user }, parsedInput: lessonIds }) => {
    const course = await findCourseByLessonIdQuery(lessonIds[0]);
    if (!course) throw new Error("Le cours n'existe pas");

    if (!hasPermission(user, "lessons", "update", course))
      throw new Error(
        "Vous n'avez pas la permission de réorganiser les leçons"
      );

    await Promise.all(
      lessonIds.map((id, index) => updateLessonQuery(id, { order: index + 1 }))
    );
  });

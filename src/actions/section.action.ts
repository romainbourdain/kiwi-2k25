"use server";

import { actionClient } from "@/lib/action";
import { hasPermission } from "@/lib/permissions";
import { sectionSchema } from "@/schemas/section.schema";
import {
  findCourseByIdQuery,
  findCourseBySectionIdQuery,
} from "@/services/course.service";
import {
  createSectionQuery,
  deleteSectionQuery,
  updateSectionQuery,
} from "@/services/section.service";
import { z } from "zod";

export const createSectionAction = actionClient
  .schema(sectionSchema)
  .bindArgsSchemas<[courseId: z.ZodString]>([z.string()])
  .action(
    async ({
      ctx: { user },
      parsedInput,
      bindArgsParsedInputs: [courseId],
    }) => {
      const course = await findCourseByIdQuery(courseId);
      if (!course) throw new Error("Le cours n'existe pas");

      if (!hasPermission(user, "sections", "create", course))
        throw new Error("Vous n'avez pas la permission de créer une section");

      await createSectionQuery(courseId, parsedInput);
    }
  );

export const updateSectionAction = actionClient
  .schema(sectionSchema)
  .bindArgsSchemas<[id: z.ZodString]>([z.string()])
  .action(
    async ({ ctx: { user }, parsedInput, bindArgsParsedInputs: [id] }) => {
      const course = await findCourseBySectionIdQuery(id);
      if (!course) throw new Error("Le cours n'existe pas");

      if (!hasPermission(user, "sections", "update", course))
        throw new Error(
          "Vous n'avez pas la permission de mettre à jour cette section"
        );

      await updateSectionQuery(id, parsedInput);
    }
  );

export const deleteSectionAction = actionClient
  .bindArgsSchemas<[id: z.ZodString]>([z.string()])
  .action(async ({ ctx: { user }, bindArgsParsedInputs: [id] }) => {
    const course = await findCourseBySectionIdQuery(id);
    if (!course) throw new Error("Le cours n'existe pas");

    if (!hasPermission(user, "sections", "delete", course))
      throw new Error(
        "Vous n'avez pas la permission de supprimer cette section"
      );

    await deleteSectionQuery(id);
  });

export const updateSectionOrdersAction = actionClient
  .schema(z.array(z.string()).nonempty())
  .action(async ({ ctx: { user }, parsedInput: sectionIds }) => {
    const course = await findCourseBySectionIdQuery(sectionIds[0]);
    if (!course) throw new Error("Le cours n'existe pas");

    if (!hasPermission(user, "sections", "update", course))
      throw new Error(
        "Vous n'avez pas la permission de réorganiser les sections"
      );

    await Promise.all(
      sectionIds.map((id, index) =>
        updateSectionQuery(id, { order: index + 1 })
      )
    );
  });

"use server";

import { getCurrentUser } from "@/actions/user.action";
import { SectionData, sectionSchema } from "@/features/sections/section.schema";
import { hasPermission } from "@/lib/permissions";
import {
  findCourseByIdQuery,
  findCourseBySectionIdQuery,
} from "@/services/course.service";
import {
  createSectionQuery,
  deleteSectionQuery,
  updateSectionQuery,
} from "@/services/section.service";

export const createSection = async (
  courseId: string,
  unsafeData: SectionData
) => {
  const { success, data } = sectionSchema.safeParse(unsafeData);
  if (!success)
    return {
      error: true,
      message: "Les données de la section sont invalides",
    };

  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour créer une section",
    };

  const course = await findCourseByIdQuery(courseId);
  if (!course)
    return {
      error: true,
      message: "Le cours n'existe pas",
    };

  if (!hasPermission(user, "sections", "create", course))
    return {
      error: true,
      message: "Vous n'avez pas la permission de créer cette section",
    };

  await createSectionQuery(courseId, data);

  return {
    error: false,
    message: "La section a été créée avec succès",
  };
};

export const updateSection = async (id: string, unsafeData: SectionData) => {
  const { success, data } = sectionSchema.safeParse(unsafeData);
  if (!success)
    return {
      error: true,
      message: "Les données de la section sont invalides",
    };

  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour mettre à jour une section",
    };

  const course = await findCourseBySectionIdQuery(id);
  if (!course)
    return {
      error: true,
      message: "Le cours n'existe pas",
    };

  if (!hasPermission(user, "sections", "update", course))
    return {
      error: true,
      message: "Vous n'avez pas la permission de mettre à jour cette section",
    };

  await updateSectionQuery(id, data);

  return {
    error: false,
    message: "La section a été mis à jour avec succès",
  };
};

export const deleteSection = async (id: string) => {
  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour supprimer cette section",
    };

  const course = await findCourseBySectionIdQuery(id);
  if (!course)
    return {
      error: true,
      message: "Le cours n'existe pas",
    };

  if (!hasPermission(user, "sections", "delete", course))
    return {
      error: true,
      message: "Vous n'avez pas la permission de supprimer cette section",
    };

  await deleteSectionQuery(id);

  return {
    error: false,
    message: "La section a été supprimée avec succès",
  };
};

export const updateSectionOrders = async (sectionIds: string[]) => {
  if (sectionIds.length === 0)
    return {
      error: true,
      message: "Aucune section à réorganiser",
    };

  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour réorganiser les sections",
    };

  const course = await findCourseBySectionIdQuery(sectionIds[0]);
  if (!course)
    return {
      error: true,
      message: "Le cours n'existe pas",
    };

  if (!hasPermission(user, "sections", "update", course))
    return {
      error: true,
      message: "Vous n'avez pas la permission de réorganiser les sections",
    };

  await Promise.all(
    sectionIds.map((id, index) => updateSectionQuery(id, { order: index + 1 }))
  );

  return {
    error: false,
    message: "Les sections ont été réorganisées avec succès",
  };
};

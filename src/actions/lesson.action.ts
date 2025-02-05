"use server";

import { getCurrentUser } from "@/actions/user.action";
import { LessonData, lessonSchema } from "@/features/lessons/lesson.schema";
import { hasPermission } from "@/lib/permissions";
import {
  findCourseByLessonIdQuery,
  findCourseBySectionIdQuery,
} from "@/services/course.service";
import {
  createLessonQuery,
  deleteLessonQuery,
  updateLessonQuery,
} from "@/services/lesson.service";

export const createLesson = async (unsafeData: LessonData) => {
  const { success, data } = lessonSchema.safeParse(unsafeData);
  if (!success)
    return {
      error: true,
      message: "Les données de la leçon sont invalides",
    };

  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour créer une leçon",
    };

  const course = await findCourseBySectionIdQuery(data.sectionId);
  if (!course)
    return {
      error: true,
      message: "Le cours n'existe pas",
    };

  if (!success || !hasPermission(user, "lessons", "create", course))
    return {
      error: true,
      message: "Vous n'avez pas la permission de créer cette leçon",
    };

  await createLessonQuery(data.sectionId, data);

  return {
    error: false,
    message: "La leçon a été créée avec succès",
  };
};

export const updateLesson = async (id: string, unsafeData: LessonData) => {
  const { success, data } = lessonSchema.safeParse(unsafeData);
  if (!success)
    return {
      error: true,
      message: "Les données de la leçon sont invalides",
    };

  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour mettre à jour une leçon",
    };

  const course = await findCourseByLessonIdQuery(id);
  if (!course)
    return {
      error: true,
      message: "Le cours n'existe pas",
    };

  if (!hasPermission(user, "lessons", "update", course))
    return {
      error: true,
      message: "Vous n'avez pas la permission de mettre à jour cette leçon",
    };

  await updateLessonQuery(id, data);

  return {
    error: false,
    message: "La leçon a été mis à jour avec succès",
  };
};

export const deleteLesson = async (id: string) => {
  const user = await getCurrentUser();
  if (!user)
    return {
      error: true,
      message: "Vous devez être connecté pour supprimer cette leçon",
    };

  const course = await findCourseByLessonIdQuery(id);
  if (!course)
    return {
      error: true,
      message: "Le cours n'existe pas",
    };

  if (!hasPermission(user, "lessons", "delete", course))
    return {
      error: true,
      message: "Vous n'avez pas la permission de supprimer cette leçon",
    };

  await deleteLessonQuery(id);

  return {
    error: false,
    message: "La leçon a été supprimée avec succès",
  };
};

export const updateLessonsOrder = async (lessonIds: string[]) => {
  if (lessonIds.length === 0)
    return {
      error: true,
      message: "Aucune leçon à réorganiser",
    };

  const user = await getCurrentUser();
  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour réorganiser les leçons",
    };
  }

  const course = await findCourseByLessonIdQuery(lessonIds[0]);
  if (!course) {
    return {
      error: true,
      message: "Le cours n'existe pas",
    };
  }

  if (!hasPermission(user, "lessons", "update", course)) {
    return {
      error: true,
      message: "Vous n'avez pas la permission de réorganiser les leçons",
    };
  }

  await Promise.all(
    lessonIds.map((id, index) => updateLessonQuery(id, { order: index + 1 }))
  );

  return {
    error: false,
    message: "Les leçons ont été réorganisées avec succès",
  };
};

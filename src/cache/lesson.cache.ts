import { getGlobalTag, getIdTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";
import { revalidateSectionCache } from "./section.cache";

export const getLessonGlobalTag = () => {
  return getGlobalTag("lessons");
};

export const getLessonIdTag = (id: string) => {
  return getIdTag("lessons", id);
};

export const revalidateLessonCache = (
  courseId: string,
  sectionId: string,
  id: string
) => {
  revalidateSectionCache(courseId, sectionId);
  revalidateTag(getLessonGlobalTag());
  revalidateTag(getLessonIdTag(id));
};

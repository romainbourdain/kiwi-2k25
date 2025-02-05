import { getGlobalTag, getIdTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";
import { revalidateCourseCache } from "./course.cache";

export const getSectionGlobalTag = () => {
  return getGlobalTag("sections");
};

export const getSectionIdTag = (id: string) => {
  return getIdTag("sections", id);
};

export const revalidateSectionCache = (courseId: string, id: string) => {
  revalidateCourseCache(courseId);
  revalidateTag(getSectionGlobalTag());
  revalidateTag(getSectionIdTag(id));
};

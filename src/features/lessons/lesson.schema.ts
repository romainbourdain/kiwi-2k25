import { CourseStatus } from "@prisma/client";
import { z } from "zod";

export const lessonSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  sectionId: z.string().min(1, { message: "Required" }),
  status: z.enum([CourseStatus.PRIVATE, CourseStatus.PUBLIC]),
  description: z
    .string()
    .transform((v) => (v === "" ? null : v))
    .nullable(),
});

export type LessonData = z.infer<typeof lessonSchema>;

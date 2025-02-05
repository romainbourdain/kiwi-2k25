import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
});

export type CourseData = z.infer<typeof courseSchema>;

import { z } from "zod";

export const sectionSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  status: z.enum(["PUBLIC", "PRIVATE"]),
});

export type SectionData = z.infer<typeof sectionSchema>;

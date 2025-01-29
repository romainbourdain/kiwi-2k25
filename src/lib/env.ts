import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // authentication
    AUTH_SECRET: z.string().min(1),
    AUTH_GITHUB_ID: z.string().min(1),
    AUTH_GITHUB_SECRET: z.string().min(1),

    // database
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PORT: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
    POSTGRES_SCHEMA: z.string().min(1),
    DATABASE_URL: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});

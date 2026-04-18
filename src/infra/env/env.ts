import { strBool } from '@api/schema/common';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number().optional().default(3000),
  HOST: z.string(),

  JWT_SECRET: z.string(),

  DB_NAME: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.coerce.string(),
  DB_ROOT_PASSWORD: z.coerce.string().optional(),
  DB_PORT: z.coerce.number(),

  COOKIE_SECRET: z.string(),
  COOKIE_HTTP_ONLY: strBool.default(true),
  COOKIE_SECURE: strBool.default(true),
  COOKIE_SAME_SITE: z.enum(['none', 'lax', 'strict']).default('none'),

  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_ADDRESS: z.string(),
  EMAIL_PASSWORD: z.string(),

  ALLOWED_ORIGINS: z.string(),
});

export type Env = z.infer<typeof envSchema>;
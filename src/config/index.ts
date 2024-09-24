import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  JWT_SECRET_KEY: z.string().min(1, 'JWT_SECRET_KEY is required'),
  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  DEFAULT_USER_ROLE_ID: z.string().uuid('DEFAULT_USER_ROLE_ID must be a valid UUID'),
  SESSION_SECRET: z.string().min(1, 'SESSION_SECRET is required'),
  BASE_URL: z.string().url('BASE_URL must be a valid URL'),
  GOOGLE_CALLBACK_URL: z.string().url('GOOGLE_CALLBACK_URL must be a valid URL'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  OPENAI_MODEL: z.string().min(1, 'OPENAI_MODEL is required'),
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    errorMap: () => ({ message: 'NODE_ENV must be one of development, production, or test' }),
  }),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('⚠️ Environment variable validation error:', env.error.format());
  process.exit(1); 
}

export const {
  DATABASE_URL,
  JWT_SECRET_KEY,
  REFRESH_TOKEN_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  DEFAULT_USER_ROLE_ID,
  SESSION_SECRET,
  BASE_URL,
  GOOGLE_CALLBACK_URL,
  OPENAI_API_KEY,
  OPENAI_MODEL,
  NODE_ENV,
} = env.data;

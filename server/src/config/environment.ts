import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3001').transform(Number),
  FIRETV_IP: z.string().min(1, 'FIRETV_IP is required'),
  CORS_ORIGIN: z.string().default('*'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

let runtimeConfig = {
  deviceIp: env.FIRETV_IP,
};

export function getConfig() {
  return { ...runtimeConfig };
}

export function updateConfig(ip: string) {
  runtimeConfig.deviceIp = ip;
}

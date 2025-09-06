// Ensure environment variables from .env are loaded when Prisma detects a config file
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  // Explicitly set schema path (also passed via CLI, but harmless here)
  schema: './prisma/schema.prisma',
  seed: 'ts-node ./prisma/seed.ts',
});

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  // @ts-expect-error 'seed' belum dikenal di PrismaConfig type
  seed: "bun run prisma/seed.ts",
});
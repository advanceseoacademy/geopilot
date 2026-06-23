import "dotenv/config";
import { defineConfig } from "prisma/config";

// Placeholder URL allows `prisma generate` on Vercel before env vars are required at runtime.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
  },
});

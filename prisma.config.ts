import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Falls back to a placeholder so `prisma generate` works without a live DB.
    // Set DATABASE_URL in your Vercel project env vars before running migrations.
    url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/orderroom",
  },
})

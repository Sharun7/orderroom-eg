import { PrismaClient } from "@prisma/client"

// Aurora PostgreSQL uses IAM auth — the actual connection is handled by
// the Aurora skill's db-aurora.ts pool. Prisma is used for type-safe queries
// when DATABASE_URL (a plain connection string) is available.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

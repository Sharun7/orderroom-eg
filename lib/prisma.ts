import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

// Global singleton so we don't exhaust connection pool in hot-reload dev environments.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    // Return a bare client without an adapter when DATABASE_URL is not set
    // (e.g. during `next build` before env vars are injected). Queries will
    // fail at runtime until the variable is set in Vercel.
    return new PrismaClient()
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

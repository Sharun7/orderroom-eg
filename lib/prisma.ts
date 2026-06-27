// Prisma client initialization - optional for demo mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createPrismaClient(): any {
  try {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      // No database URL - return null for demo mode
      return null
    }
    
    // Try to import and use PrismaPg adapter
    try {
      const { PrismaPg } = require("@prisma/adapter-pg")
      const { PrismaClient } = require("@prisma/client")
      const adapter = new PrismaPg({ connectionString })
      return new PrismaClient({ adapter })
    } catch {
      // Fallback to basic PrismaClient
      const { PrismaClient } = require("@prisma/client")
      return new PrismaClient()
    }
  } catch {
    // If all fails, return null
    return null
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma
}

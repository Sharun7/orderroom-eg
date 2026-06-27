/**
 * lib/prisma.ts
 * Prisma 7 client wired to AWS Aurora PostgreSQL via IAM auth + @prisma/adapter-pg.
 * Falls back gracefully when DB env vars are absent (CI / preview builds).
 */
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { Signer } from "@aws-sdk/rds-signer"
import { awsCredentialsProvider } from "@vercel/functions/oidc"

const ROLE_ARN = process.env.AWS_APG_AWS_ROLE_ARN ?? process.env.AWS_ROLE_ARN ?? ""
const REGION   = process.env.AWS_APG_AWS_REGION   ?? process.env.AWS_REGION   ?? "us-east-1"
const PGHOST   = process.env.AWS_APG_PGHOST        ?? process.env.PGHOST       ?? ""
const PGUSER   = process.env.AWS_APG_PGUSER        ?? process.env.PGUSER       ?? "postgres"
const PGDB     = process.env.AWS_APG_PGDATABASE    ?? process.env.PGDATABASE   ?? "postgres"
const PGPORT   = parseInt(process.env.AWS_APG_PGPORT ?? "5432")

function makePool(): Pool | null {
  if (!PGHOST || !ROLE_ARN) return null
  const signer = new Signer({
    credentials: awsCredentialsProvider({
      roleArn: ROLE_ARN,
      clientConfig: { region: REGION },
    }),
    region: REGION,
    hostname: PGHOST,
    username: PGUSER,
    port: PGPORT,
  })
  return new Pool({
    host:     PGHOST,
    database: PGDB,
    port:     PGPORT,
    user:     PGUSER,
    password: () => signer.getAuthToken(),
    ssl:      { rejectUnauthorized: false },
    max:      10,
  })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function makePrismaClient(): PrismaClient {
  const pool = makePool()

  if (pool) {
    const adapter = new PrismaPg(pool)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PrismaClient({ adapter } as any)
  }

  // Fallback: use DATABASE_URL (plain connection string) via a basic Pool
  // so that Prisma 7's mandatory adapter requirement is always satisfied.
  const fallbackUrl = process.env.DATABASE_URL ?? ""
  const fallbackPool = new Pool({
    connectionString: fallbackUrl,
    ssl: fallbackUrl.includes("rds.amazonaws.com") ? { rejectUnauthorized: false } : false,
    max: 5,
  })
  const fallbackAdapter = new PrismaPg(fallbackPool)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter: fallbackAdapter } as any)
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = makePrismaClient())

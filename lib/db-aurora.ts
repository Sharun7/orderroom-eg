import { Pool, ClientBase } from 'pg'
import { Signer } from '@aws-sdk/rds-signer'
import { awsCredentialsProvider } from '@vercel/functions/oidc'
import { attachDatabasePool } from '@vercel/functions'

const ROLE_ARN  = process.env.AWS_APG_AWS_ROLE_ARN  ?? process.env.AWS_ROLE_ARN  ?? ""
const REGION    = process.env.AWS_APG_AWS_REGION    ?? process.env.AWS_REGION    ?? "us-east-1"
const PGHOST    = process.env.AWS_APG_PGHOST        ?? process.env.PGHOST        ?? ""
const PGUSER    = process.env.AWS_APG_PGUSER        ?? process.env.PGUSER        ?? "postgres"
const PGDB      = process.env.AWS_APG_PGDATABASE    ?? process.env.PGDATABASE    ?? "postgres"

// Initialize RDS Signer with AWS IAM authentication
const signer = new Signer({
  credentials: awsCredentialsProvider({
    roleArn: ROLE_ARN,
    clientConfig: { region: REGION },
  }),
  region: REGION,
  hostname: PGHOST,
  username: PGUSER,
  port: parseInt(process.env.AWS_APG_PGPORT ?? "5432"),
})

// Create connection pool
const pool = new Pool({
  host: PGHOST,
  database: PGDB,
  port: parseInt(process.env.AWS_APG_PGPORT ?? "5432"),
  user: PGUSER,
  // Generate auth token dynamically (cached for up to 15 minutes)
  password: () => signer.getAuthToken(),
  // SSL configuration for AWS Aurora
  ssl: { rejectUnauthorized: false },
  max: 20, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

// Attach pool to Vercel Functions for monitoring
attachDatabasePool(pool)

// Single query execution
export async function query(text: string, params?: unknown[]) {
  try {
    const result = await pool.query(text, params)
    return result
  } catch (error) {
    console.error('[DB Aurora] Query error:', error)
    throw error
  }
}

// Transaction support for multi-query operations
export async function withConnection<T>(
  fn: (client: ClientBase) => Promise<T>,
): Promise<T> {
  const client = await pool.connect()
  try {
    return await fn(client)
  } catch (error) {
    console.error('[DB Aurora] Transaction error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Health check
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await query('SELECT 1')
    return result.rows.length > 0
  } catch {
    return false
  }
}

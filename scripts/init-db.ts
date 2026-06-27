import { readFileSync } from 'fs'
import { join } from 'path'
import { Pool } from 'pg'
import { Signer } from '@aws-sdk/rds-signer'

/**
 * Initialize AWS Aurora PostgreSQL database
 * Run this script to set up the OrderRoom database schema
 * 
 * Usage: pnpm ts-node scripts/init-db.ts
 */

async function initializeDatabase() {
  console.log('Initializing AWS Aurora PostgreSQL database...')
  
  // Validate environment variables
  const requiredEnvVars = [
    'AWS_APG_PGHOST',
    'AWS_APG_PGUSER',
    'AWS_APG_PGDATABASE',
    'AWS_APG_AWS_ROLE_ARN',
    'AWS_APG_AWS_REGION'
  ]
  
  const missing = requiredEnvVars.filter(env => !process.env[env])
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing)
    process.exit(1)
  }

  try {
    // Create signer for IAM authentication
    const signer = new Signer({
      region: process.env.AWS_APG_AWS_REGION!,
      hostname: process.env.AWS_APG_PGHOST!,
      username: process.env.AWS_APG_PGUSER!,
      port: parseInt(process.env.AWS_APG_PGPORT || '5432'),
    })

    // Create connection pool
    const pool = new Pool({
      host: process.env.AWS_APG_PGHOST,
      database: process.env.AWS_APG_PGDATABASE,
      port: parseInt(process.env.AWS_APG_PGPORT || '5432'),
      user: process.env.AWS_APG_PGUSER,
      password: () => signer.getAuthToken(),
      ssl: { rejectUnauthorized: false },
    })

    console.log('Connecting to Aurora PostgreSQL...')
    const client = await pool.connect()
    
    try {
      // Read and execute schema SQL file
      const schemaPath = join(__dirname, '001-create-orderroom-schema.sql')
      const schemaSQL = readFileSync(schemaPath, 'utf-8')
      
      console.log('Creating database schema...')
      await client.query(schemaSQL)
      
      console.log('✅ Database schema created successfully!')
      console.log('✅ All tables and indexes initialized!')
      
      // Verify tables were created
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `)
      
      console.log('\nCreated tables:')
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name}`)
      })
      
    } finally {
      client.release()
    }

    await pool.end()
    console.log('\n✅ Database initialization complete!')
    
  } catch (error) {
    console.error('Database initialization failed:', error)
    process.exit(1)
  }
}

// Run initialization
initializeDatabase().catch(console.error)

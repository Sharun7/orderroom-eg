# AWS Aurora PostgreSQL Setup Guide

## Overview

OrderRoom is now fully integrated with **AWS Aurora PostgreSQL** for production-grade database operations. All environment variables are already configured in your v0 workspace.

## Environment Variables (Already Set)

Your AWS Aurora PostgreSQL environment variables are automatically configured:

```env
AWS_APG_PGHOST=your-aurora-cluster.amazonaws.com
AWS_APG_PGUSER=postgres
AWS_APG_PGDATABASE=orderroom
AWS_APG_AWS_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/aurora-role
AWS_APG_AWS_REGION=us-east-1
AWS_APG_PGPORT=5432
AWS_APG_AWS_ACCOUNT_ID=123456789012
AWS_APG_PGSSLMODE=require
```

## Database Schema

The following tables have been created in `scripts/001-create-orderroom-schema.sql`:

### Core Tables

1. **business** - Restaurant/hotel/catering businesses
   - business_id, name, email, subscription_plan, vendor_limit
   - created_at, updated_at

2. **user** - Business managers and staff
   - user_id, business_id (FK), email, name, password_hash, role
   - created_at, updated_at

3. **vendor** - Suppliers and vendors
   - vendor_id, business_id (FK), name, email, phone
   - lead_time_hours, is_active
   - created_at, updated_at

4. **product** - Items available from vendors
   - product_id, vendor_id (FK), name, unit, unit_price, category
   - created_at, updated_at

5. **order** - Main orders created by businesses
   - order_id, business_id (FK), user_id (FK), status, order_date, delivery_date, notes
   - created_at, updated_at

6. **order_item** - Individual line items per vendor per order
   - order_item_id, order_id (FK), vendor_id (FK), product_id (FK)
   - quantity, unit, status, confirmation_token, confirmed_at
   - created_at, updated_at

7. **event** - Audit trail for all order events
   - event_id, business_id (FK), order_id (FK), order_item_id (FK)
   - event_type, event_data (JSONB), created_at

8. **subscription** - Billing and subscription tracking
   - subscription_id, business_id (FK), stripe_customer_id
   - plan, status, current_period_start, current_period_end
   - created_at, updated_at

### ENUM Types

- `order_status`: 'pending', 'sent', 'confirmed', 'rejected', 'delivered', 'completed'
- `user_role`: 'owner', 'manager', 'viewer'
- `subscription_plan`: 'free', 'starter', 'pro'

### Indexes

All important columns are indexed for performance:
- Foreign keys (FKs)
- Status columns
- Business and user lookups
- Date columns
- Frequently queried combinations

## How to Initialize the Database

### Option 1: Using the Init Script (Recommended)

```bash
cd /vercel/share/v0-project
pnpm ts-node scripts/init-db.ts
```

This will:
1. Connect to your Aurora cluster using IAM authentication
2. Create all tables, enums, and indexes
3. Verify successful creation
4. Display list of created tables

### Option 2: Manual SQL Execution

1. Connect to your Aurora cluster using a PostgreSQL client:
   ```bash
   psql postgresql://postgres:password@your-aurora-cluster.amazonaws.com:5432/orderroom
   ```

2. Copy the entire content of `scripts/001-create-orderroom-schema.sql`

3. Paste into the psql terminal and execute

## Database Connection in Code

### Using Aurora Directly

```typescript
import { query, withConnection } from '@/lib/db-aurora'

// Single query
const result = await query(
  'SELECT * FROM business WHERE business_id = $1',
  ['biz-123']
)

// Transaction
const result = await withConnection(async (client) => {
  const order = await client.query('INSERT INTO "order" (...) RETURNING *')
  const items = await client.query('INSERT INTO order_item (...)')
  return { order, items }
})
```

### API Routes Using Aurora

All `/api/db/*` endpoints use Aurora directly:

```typescript
import { query } from '@/lib/db-aurora'

export async function GET(req: NextRequest) {
  const result = await query(
    'SELECT * FROM orders WHERE business_id = $1',
    [businessId]
  )
  return NextResponse.json(result.rows)
}
```

## Security Best Practices

✅ **IAM Authentication**: Uses temporary tokens (rotated every 15 minutes)
✅ **SSL Encryption**: All connections encrypted in transit
✅ **Parameterized Queries**: All queries use `$1, $2` placeholders to prevent SQL injection
✅ **Connection Pooling**: Max 20 concurrent connections with automatic cleanup
✅ **Error Handling**: Detailed error logging without exposing sensitive data

## Performance Optimization

### Connection Pool Settings

- **Pool Size**: 20 connections
- **Idle Timeout**: 30 seconds
- **Connection Timeout**: 5 seconds
- **Token Cache**: 15 minutes

### Query Optimization Tips

1. Always use `WHERE` clauses with indexed columns
2. Use `LIMIT` for large result sets
3. Batch large INSERT/UPDATE operations
4. Use indexes for `ORDER BY` and `GROUP BY`
5. Run `VACUUM ANALYZE` after bulk operations

## Monitoring and Debugging

### Health Check

```typescript
import { healthCheck } from '@/lib/db-aurora'

const isHealthy = await healthCheck()
console.log('Database status:', isHealthy ? 'OK' : 'ERROR')
```

### Enable Query Logging

In development, view all queries:
```typescript
pool.on('query', (query) => {
  console.log('[DB Query]', query.text, query.values)
})
```

### Common Issues

**Connection Timeout**
- Verify AWS_ROLE_ARN has correct permissions
- Check security group allows inbound on port 5432
- Ensure IAM role trusts Vercel

**Authentication Failed**
- Verify PGUSER and PGDATABASE are correct
- Check AWS_REGION matches cluster region
- Regenerate IAM token if expired

**Table Not Found**
- Run initialization script: `pnpm ts-node scripts/init-db.ts`
- Verify you're using correct database name

## Next Steps

1. ✅ Environment variables configured
2. ✅ Schema SQL created
3. ✅ Init script ready
4. Run: `pnpm ts-node scripts/init-db.ts` to initialize
5. Test with: `curl http://localhost:3000/api/db/orders?businessId=demo`

Your OrderRoom application is now ready for production with AWS Aurora PostgreSQL!

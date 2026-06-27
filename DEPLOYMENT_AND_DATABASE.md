# OrderRoom - Deployment & Database Guide

## Project Overview

**OrderRoom** is a B2B SaaS platform for restaurants, hotels, and catering businesses to streamline vendor ordering. Built for the Vercel Hackathon.

**GitHub Repository:** Your local commits are ready to push
**Vercel Project ID:** prj_K9KU3c2PolUSehbzkebE91RibGER
**Vercel Team:** sharun-tomy-s-projects (team_g1PyOTmfSgXwJHFdOeKTEkNv)

---

## Database Architecture

OrderRoom uses a **hybrid database strategy** combining the strengths of both SQL and NoSQL:

### 1. **Primary Database: Neon PostgreSQL**
- **Purpose:** Transactional data (businesses, users, vendors, products, orders, subscriptions)
- **Why PostgreSQL?** 
  - ACID compliance for critical ordering and vendor data
  - Complex relational queries for business analytics
  - Strong consistency guarantees
  - Easy integration with Prisma ORM
- **Connection:** Via `DATABASE_URL` environment variable
- **Provider:** Neon (serverless PostgreSQL)
- **Schema Location:** `prisma/schema.prisma`

**Tables:**
```
- Business (company/restaurant/hotel)
- User (staff accounts with bcrypt password hashing)
- Vendor (suppliers: farms, bakeries, butchers, beverage distributors)
- Product (items vendors supply)
- Order (daily orders to vendors)
- OrderItem (individual line items with status tracking)
- Subscription (plan limits: Free=1 vendor, Starter=10 vendors, Pro=999)
```

### 2. **Event Audit Trail: AWS DynamoDB**
- **Purpose:** Real-time event logging and audit trail
- **Why DynamoDB?**
  - Scales to millions of events without latency
  - No provisioning needed (on-demand pricing)
  - Perfect for write-heavy workloads (every action = 1 event)
  - Low-latency reads for activity feeds
- **Partition Key:** `businessId`
- **Sort Key:** `timestamp`
- **Events Logged:**
  - `order.sent` — Order dispatched to vendors
  - `order_item.confirmed` — Vendor confirmed their items
  - `order_item.rejected` — Vendor declined items
  - `order_item.delivered` — Physical delivery occurred
  - `order.completed` — All items confirmed/rejected

**Environment Variables:**
```
AWS_REGION=us-east-1 (or your region)
DYNAMODB_TABLE_NAME=orderroom_events (or your table name)
```

### 3. **Email Service: Resend**
- **Purpose:** Vendor confirmation emails with one-click links
- **Why Resend?** Built for developers, dead simple API, 1000 free emails/day
- **Flow:** Order created → Email sent to each vendor → Vendor clicks confirmation link → DynamoDB event logged
- **Environment Variable:** `RESEND_API_KEY`

---

## Database Decision: Why Neon + DynamoDB?

| Requirement | Neon PostgreSQL | DynamoDB | Decision |
|-------------|-----------------|----------|----------|
| **Consistency** | Strong ACID | Eventually consistent | PostgreSQL for orders, subscriptions |
| **Scale** | Scales linearly | Unlimited auto-scale | DynamoDB for event volume |
| **Query Complexity** | JOINs, transactions | Key-value lookups | PostgreSQL for analytics |
| **Real-time** | Poll-based | Streams, TTL | DynamoDB for activity feeds |
| **Cost** | Pay per compute | Pay per request | DynamoDB wins on events, PostgreSQL on queries |

**Why NOT AWS Aurora PostgreSQL?** 
Neon provides better developer experience (instant provisioning, auto-scaling, connection pooling) and works seamlessly with Vercel's ecosystem. You can migrate to Aurora later if needed.

---

## Deployment Instructions

### Step 1: Push to GitHub

```bash
cd /vercel/share/v0-project
git remote set-url origin https://github.com/YOUR_USERNAME/orderroom.git
git push origin master
```

### Step 2: Deploy to Vercel

The project is already set up with Vercel. To deploy:

**Option A: CLI Deployment**
```bash
vercel deploy --prod --scope team_g1PyOTmfSgXwJHFdOeKTEkNv
```

**Option B: Via Dashboard**
1. Go to https://vercel.com/sharun-tomy-s-projects/katachi
2. Connect your GitHub repository
3. Click "Deploy"

### Step 3: Set Environment Variables in Vercel

Go to **Project Settings → Environment Variables** and add:

```
# Database
DATABASE_URL=postgresql://user:password@your-neon-db.neon.tech/orderroom

# AWS DynamoDB
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=orderroom-events
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# Auth
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=https://orderroom.vercel.app

# App
NEXT_PUBLIC_APP_URL=https://orderroom.vercel.app
```

### Step 4: Seed Database

Run the Prisma seed script to populate demo data:

```bash
pnpm db:seed
```

This creates:
- 1 demo business (The Harbor Restaurant)
- 1 demo user (demo@orderroom.io / demo1234)
- 5 demo vendors (farms, bakeries, etc.)
- Demo products for each vendor
- Today's order with mixed vendor statuses

---

## Local Development

### Running Locally

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.development.local.example .env.development.local
# Fill in your DATABASE_URL, AWS keys, etc.

# Start dev server
pnpm dev

# Open http://localhost:3000
```

### Database Migrations

```bash
# Create migration
pnpm prisma migrate dev --name add_subscriptions

# Push schema changes
pnpm prisma db push

# Seed data
pnpm db:seed
```

---

## Production Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                      │
│                  (SSR, API Routes, Middleware)               │
└─────────────────────────────────────────────────────────────┘
         ↓                          ↓                    ↓
   ┌─────────────┐         ┌──────────────┐    ┌──────────────┐
   │ Neon DB     │         │ DynamoDB     │    │ Resend Email │
   │ (Orders,    │         │ (Events,     │    │ (Vendor      │
   │ Vendors,    │         │ Audit Trail) │    │ Confirmations)
   │ Subs)       │         │              │    │              │
   └─────────────┘         └──────────────┘    └──────────────┘
         ↑                          ↑                    ↑
   ┌─────────────────────────────────────────────────────────┐
   │              Restaurant Owner (Web App)                  │
   │  • Dashboard                                              │
   │  • Create Orders                                          │
   │  • Vendor Management                                      │
   └─────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────┐
   │         Vendor (Email Confirmation Link)                 │
   │  • One-click confirmation via secure token               │
   │  • DynamoDB logs the event                               │
   │  • Email sent via Resend                                 │
   └─────────────────────────────────────────────────────────┘
```

---

## Key Features by Database

### Neon PostgreSQL Features
- Real-time order status (`pending` → `sent` → `confirmed` → `delivered`)
- Vendor management and product catalogs
- Subscription plan enforcement (vendor limits)
- User authentication with bcrypt hashing
- Audit queries: "Show me all orders from March"

### DynamoDB Features
- Millisecond activity feed queries
- Event sourcing: Full history of every action
- TTL policies: Auto-delete events after 90 days
- Real-time dashboards: "What happened in the last hour?"

### Stripe Integration
- Three-tier pricing (Free/Starter/Pro)
- Vendor limit enforcement: Free users can only add 1 vendor
- Monthly billing cycles with Stripe portal

---

## Git Commits Ready to Push

Local commits are ready:
```
de91226 feat: add time formatting function & update login route & remove order notes display
85bfa64 feat: add premium design effects and animations to global styles
841c05f feat: enhance dashboard with server-side session handling and dynamic data fetching
a856a74 feat: add new blog post page with detailed project description and architecture
bbf40d8 feat: introduce new ArchitecturePage component with detailed system architecture layout
```

Push with:
```bash
git push origin master
```

---

## Support & Troubleshooting

**Database Connection Issues?**
- Check `DATABASE_URL` format: `postgresql://user:password@host/database`
- Verify Neon project is active
- Test connection: `pnpm prisma db execute --stdin`

**DynamoDB Events Not Logging?**
- Verify AWS credentials in environment
- Check table name matches `DYNAMODB_TABLE_NAME`
- Run `aws dynamodb describe-table --table-name orderroom-events`

**Deployment Stuck?**
- Check build logs: `vercel logs --scope team_g1PyOTmfSgXwJHFdOeKTEkNv`
- Verify all env vars are set
- Check for TypeScript errors: `pnpm exec tsc --noEmit`

---

## Next Steps

1. ✅ Connect GitHub repository
2. ✅ Deploy to Vercel production
3. Set up Neon PostgreSQL and connect `DATABASE_URL`
4. Create AWS DynamoDB table and set AWS credentials
5. Run `pnpm db:seed` to populate demo data
6. Configure Stripe products and webhooks
7. Set up Resend email domain
8. Monitor production dashboard at https://vercel.com/sharun-tomy-s-projects/katachi

---

**Project:** OrderRoom (Vercel Hackathon Track 2)  
**Built with:** Next.js 16, React 19, Tailwind CSS, Prisma, DynamoDB, Stripe, Resend  
**Status:** Ready for production deployment

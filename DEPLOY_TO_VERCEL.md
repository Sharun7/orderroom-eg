# Deploy OrderRoom to Vercel (Production)

Your project is built and ready to deploy to Vercel!

## Step 1: Connect GitHub to Vercel (Automatic Deployments)

After you push code to GitHub:

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New..." → "Project"**
3. Click **"Import Git Repository"**
4. Select **"GitHub"** and authorize Vercel
5. Find your repository: **Sharun7/OrderRoom**
6. Click **"Import"**

## Step 2: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

### Database (Choose ONE)
```env
# Option A: Neon PostgreSQL (Recommended for hackathon)
DATABASE_URL=postgresql://user:password@host.neon.tech/orderroom?sslmode=require
```

### AWS DynamoDB (for event logging)
```env
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=orderroom-events
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Stripe (Payments)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

### Resend (Email Vendor Confirmations)
```env
RESEND_API_KEY=re_xxxxx
```

### NextAuth (Session Management)
```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate_with: openssl rand -base64 32
```

## Step 3: Deploy

Click **"Deploy"** and wait 2-5 minutes.

Your app will be live at: **https://orderroom-xxxxx.vercel.app**

---

## Option 2: Deploy Directly from CLI (Without GitHub)

If you want to deploy right now without pushing to GitHub:

```bash
cd /path/to/OrderRoom
vercel --prod
```

This creates a preview deployment that you can share immediately.

---

## Manual One-Click Deploy (Advanced)

Create a `vercel.json` file with this, then use the Deploy Button:

```json
{
  "name": "OrderRoom",
  "description": "Restaurant vendor order management",
  "env": {
    "DATABASE_URL": {
      "description": "Neon PostgreSQL connection string",
      "required": true
    },
    "AWS_REGION": {
      "description": "AWS region for DynamoDB",
      "default": "us-east-1"
    }
  }
}
```

---

## Verify Deployment

After deployment:

1. Visit your live URL
2. Check landing page loads with animations
3. Try login with: `demo@orderroom.io / demo1234`
4. Verify dashboard loads with real-time data
5. Test vendor confirmation flow

---

## Database Setup (One-Time)

After deploying to Vercel, run this to seed your database:

```bash
# From your local machine
cd OrderRoom
pnpm db:seed

# Or from Vercel CLI
vercel env pull
pnpm db:seed
```

This creates:
- Demo business account
- Demo vendors (Fresh Farm, Prime Cuts, Ocean Select, etc.)
- Demo products
- Today's sample order

---

## Production Checklist

Before going live:

- [ ] Push code to GitHub: `git push -u origin main`
- [ ] Connect GitHub to Vercel project
- [ ] Add all environment variables in Vercel Settings
- [ ] Deploy to production
- [ ] Seed database with `pnpm db:seed`
- [ ] Test login and order flow
- [ ] Set custom domain (optional)
- [ ] Monitor logs in Vercel dashboard

---

## Troubleshooting

### Build Fails with "PrismaClient not found"
This is normal - Prisma generates the client during build. If it persists:
1. Go to Vercel Settings → Build & Development Settings
2. Set Build Command: `pnpm exec prisma generate && next build`

### Environment Variables Not Found
1. Verify they're added in Vercel Settings (not .env.local)
2. Redeploy after adding variables
3. Check variable names match exactly

### Database Connection Error
1. Verify DATABASE_URL is correct
2. Check database allows Vercel IP ranges (usually automatic)
3. For Neon: check "Allow all IPs" in connection settings

---

## Live URLs

After deployment:

- **Live App:** https://your-domain.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/Sharun7/OrderRoom

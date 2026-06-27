# OrderRoom - Quick Start Guide (READ THIS FIRST!)

## What You Built

OrderRoom is a B2B SaaS platform for restaurants to order supplies from vendors in 60 seconds. Built for a hackathon with:

- Premium landing page with 3D animations
- Real-time order dashboard  
- Vendor management system
- Email-based confirmations
- Stripe payment integration
- Full audit trail logging

---

## Push Code to GitHub (3 Steps)

### Step 1: Create GitHub Personal Access Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Check `repo` and `workflow` checkboxes
4. Click "Generate token" and copy it

### Step 2: Open Your Terminal
```bash
cd path/to/OrderRoom
git config user.name "Your Name"
git config user.email "your@email.com"
```

### Step 3: Push to GitHub
```bash
git branch -M main
git push -u origin https://github.com/Sharun7/OrderRoom.git

# When asked for password, paste your token from Step 1
```

**Done!** Your code is now on GitHub at https://github.com/Sharun7/OrderRoom

---

## Deploy to Vercel (Publish Live)

### Option A: Auto-Deploy from GitHub (Best)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Click "GitHub" and authorize
4. Find "Sharun7/OrderRoom" and click Import
5. Add environment variables (see DEPLOY_TO_VERCEL.md)
6. Click "Deploy"

**Live in 2 minutes!** Get your URL from Vercel dashboard.

### Option B: Deploy Now (No GitHub Needed)

```bash
cd OrderRoom
vercel --prod
```

Your app goes live instantly!

---

## Database Setup (AWS vs Neon)

### What Database Did We Use?

We used a **hybrid approach**:

| Database | Purpose | Why |
|----------|---------|-----|
| **Neon PostgreSQL** | Orders, vendors, users | ACID compliance, complex queries |
| **AWS DynamoDB** | Event logs, audit trail | Real-time, scales infinitely |
| **Stripe** | Payments | Industry standard |
| **Resend** | Email confirmations | Simple, reliable |

**NOT AWS Aurora** - We used Neon because it's instant to set up and integrates perfectly with Vercel.

### Setup Steps

1. **Neon PostgreSQL** (Recommended for hackathon):
   - Go to https://neon.tech
   - Click "Get started" (free tier)
   - Copy your `DATABASE_URL`
   - Add to Vercel environment variables

2. **AWS DynamoDB** (optional, for event logging):
   - Already configured in code
   - Just add AWS credentials to Vercel env vars

---

## Test Your App

### Local (Right Now)
```bash
pnpm dev
# Visit http://localhost:3000
```

### After Deploying
1. Visit your Vercel URL
2. Login: `demo@orderroom.io` / `demo1234`
3. Create an order
4. Watch vendors get email confirmations

---

## Key Files

- `PUSH_TO_GITHUB.md` - Detailed GitHub push instructions
- `DEPLOY_TO_VERCEL.md` - Detailed Vercel deployment guide
- `DEPLOYMENT_AND_DATABASE.md` - Full architecture docs
- `READY_TO_DEPLOY.md` - Complete deployment checklist

---

## 60-Second Summary

```
Your Code → GitHub → Vercel → Live App ✅

1. Push: git push -u origin main (with token)
2. Deploy: Import repo into Vercel
3. Add env vars: DATABASE_URL, STRIPE keys, etc.
4. Done: App lives at https://orderroom-xxxx.vercel.app
```

---

## What's Inside

✅ Next.js 16 + React 19  
✅ Tailwind CSS with premium animations  
✅ Neon PostgreSQL + Prisma ORM  
✅ AWS DynamoDB for event logging  
✅ Stripe for payments  
✅ Resend for emails  
✅ NextAuth for authentication  
✅ TypeScript (fully typed)  
✅ Server components + API routes  

---

## Next Steps

1. **Push to GitHub** → Follow PUSH_TO_GITHUB.md
2. **Deploy to Vercel** → Follow DEPLOY_TO_VERCEL.md
3. **Add Environment Variables** → See DEPLOY_TO_VERCEL.md
4. **Seed Database** → Run `pnpm db:seed`
5. **Test Live App** → Visit your Vercel URL

---

**You're ready to launch! 🚀**

Questions? Check the docs in the repo or visit https://vercel.com/docs

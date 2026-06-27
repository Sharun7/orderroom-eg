# How to Get DATABASE_URL and Connect to Your App

## Step 1: Create Neon PostgreSQL Account

1. Go to **https://console.neon.tech**
2. Click **"Sign Up"**
3. Enter your email and create a password
4. Click the verification link in your email
5. Login to Neon dashboard

## Step 2: Create Your Database

1. Click **"New Project"** button
2. Project name: `orderroom`
3. Select region: **US East (N. Virginia)**
4. Click **"Create Project"**
5. Wait 30-60 seconds for database to initialize

## Step 3: Get Your Connection String

1. After project is created, you'll see a **"Connection string"** section
2. Select **"Nodejs"** from the dropdown
3. You'll see a string like:
   ```
   postgresql://username:password@host.neon.tech/dbname?sslmode=require
   ```
4. Click the **copy icon** next to it
5. **This is your DATABASE_URL** - save it somewhere safe

## Step 4: Add DATABASE_URL to Vercel

1. Go to **https://vercel.com/dashboard**
2. Click on your **OrderRoom** project
3. Go to **Settings** (top menu)
4. Click **"Environment Variables"** (left sidebar)
5. Click **"Add"**
6. Fill in:
   - **Name:** `DATABASE_URL`
   - **Value:** (Paste your connection string from Neon)
   - **Environments:** Select all (Production, Preview, Development)
7. Click **"Save"**

## Step 5: Redeploy Your App

1. Go back to your Vercel project
2. Click **"Deployments"** tab
3. Find the latest deployment
4. Click the **three dots (...)** menu
5. Select **"Redeploy"**
6. Wait 2-3 minutes for deployment to complete

## Step 6: Run Database Setup

Once deployed, run the database seed to populate demo data:

```bash
# In your local terminal:
cd /path/to/OrderRoom
pnpm db:seed
```

This will create all tables and add demo data.

## Step 7: Test Login

Now your app should work fully:

1. Go to your Vercel app URL
2. Click "Sign In"
3. Use: `demo@orderroom.io / demo1234`
4. You should see the dashboard!

---

## If You Get Errors

### Error: "Database connection failed"
- Check DATABASE_URL is copied correctly
- Make sure there are no extra spaces
- Verify it starts with `postgresql://`

### Error: "Table does not exist"
- Run `pnpm db:seed` again
- Check that you have the correct DATABASE_URL

### Error: "SSL connection error"
- Make sure `?sslmode=require` is at the end of your URL
- This is required for Neon

---

## Your DATABASE_URL Should Look Like

```
postgresql://user_12345:AbCdEfGhIjKlMnOpQr@ep-cold-example-123456.us-east-1.postgres.vercel.sh/neondb?sslmode=require
```

**Keep this safe - don't share it with anyone!**

---

## What Happens When Connected

Once DATABASE_URL is set:

✅ Real users can create accounts  
✅ Orders are saved to database  
✅ Vendors stored permanently  
✅ Full audit trail in DynamoDB  
✅ All data persists between deploys  

---

## Git Status

All code changes are already pushed to GitHub:
- ✅ 29 commits on main branch
- ✅ Login fixes implemented  
- ✅ Demo mode working
- ✅ Documentation complete
- ✅ All changes synced

Your repository is ready at: **https://github.com/Sharun7/orderroom-eg**

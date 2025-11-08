# 🚀 Next Steps After Committing to GitHub

## Step 1: Commit and Push Latest Changes

You have uncommitted changes. Run these commands:

```bash
git add .
git commit -m "Add deployment configurations and fix build issues"
git push origin master
```

---

## Step 2: Deploy Frontend on Vercel

### A. Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

### B. Configure Project Settings

**⚠️ CRITICAL - Set Root Directory:**

1. In the project configuration page, find **"Root Directory"**
2. Click **"Edit"**
3. Select **"apps/web"** from the dropdown (or type `apps/web`)
4. Click **"Continue"**

**Other Settings (should auto-detect):**
- Framework: Next.js (auto-detected)
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)

### C. Add Environment Variables

**Before deploying, add these environment variables:**

1. Click **"Environment Variables"** section
2. Add:
   ```
   NEXT_PUBLIC_API_BASE=https://your-backend.onrender.com
   NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
   ```
   ⚠️ **Note**: You'll update these with actual URLs after deployment

3. For now, use placeholder:
   ```
   NEXT_PUBLIC_API_BASE=http://localhost:3001
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### D. Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. **Get your frontend URL**: `https://your-app.vercel.app`

---

## Step 3: Deploy Backend on Render

### A. Create Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect account"** → Connect GitHub
4. Select your repository
5. Click **"Connect"**

### B. Configure Service

**Basic Settings:**
- **Name**: `flowbit-api` (or your choice)
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `master` (or `main`)

**⚠️ CRITICAL - Set Root Directory:**
- **Root Directory**: `apps/api`

**Build & Start:**
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`

### C. Add Environment Variables

**Before deploying, add these:**

1. Scroll to **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Add each:

   ```
   NODE_ENV = production
   ```

   ```
   DATABASE_URL = postgresql://user:pass@host:5432/dbname
   ```
   ⚠️ Replace with your production database URL

   ```
   VANNA_API_BASE_URL = https://your-vanna.onrender.com
   ```
   ⚠️ Replace with your Vanna AI service URL (or use `http://localhost:8000` for now)

   ```
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
   ⚠️ Replace with your actual Vercel frontend URL (after Step 2)

### D. Deploy

1. Scroll down and click **"Create Web Service"**
2. Wait for build to complete
3. **Get your backend URL**: `https://your-api.onrender.com`

---

## Step 4: Update Environment Variables

### Update Frontend (Vercel)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_API_BASE` to your Render backend URL:
   ```
   NEXT_PUBLIC_API_BASE=https://your-api.onrender.com
   ```
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel frontend URL:
   ```
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
4. **Redeploy** (or wait for auto-redeploy)

### Update Backend (Render)

1. Go to Render Dashboard → Your Service → **Environment**
2. Update `FRONTEND_URL` to your Vercel frontend URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Service will **auto-redeploy**

---

## Step 5: Set Up Production Database

### Option A: Using Render Shell

1. Go to Render Dashboard → Your Service
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd apps/api
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Option B: Using Local Terminal

1. Connect to your production database
2. Run:
   ```bash
   cd apps/api
   DATABASE_URL="your-production-db-url" npx prisma migrate deploy
   DATABASE_URL="your-production-db-url" npx prisma db seed
   ```

---

## Step 6: Test Deployment

### Test Backend

1. Visit: `https://your-api.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. Test API endpoint:
   - `https://your-api.onrender.com/api/stats`
   - Should return JSON data

### Test Frontend

1. Visit: `https://your-app.vercel.app`
2. Check browser console (F12) for errors
3. Verify:
   - ✅ Dashboard loads
   - ✅ No CORS errors
   - ✅ Charts display data
   - ✅ Chat with Data works

---

## Step 7: Update SUBMISSION.md

Update `SUBMISSION.md` with your actual URLs:

```markdown
### Frontend (Vercel)
**URL**: `https://your-actual-app.vercel.app`

### Backend API (Render)
**URL**: `https://your-actual-api.onrender.com`

### Vanna AI Service
**URL**: `https://your-vanna.onrender.com`
```

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed on Vercel
- [ ] Root Directory set to `apps/web` in Vercel
- [ ] Backend deployed on Render
- [ ] Root Directory set to `apps/api` in Render
- [ ] Environment variables set correctly
- [ ] Database migrations run
- [ ] Database seeded
- [ ] Frontend can connect to backend
- [ ] All features work
- [ ] URLs updated in SUBMISSION.md

---

## 🎉 You're Done!

Your application should now be live and functional!

**Frontend**: `https://your-app.vercel.app`  
**Backend**: `https://your-api.onrender.com`

Good luck with your submission! 🚀


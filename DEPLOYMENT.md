# 🚀 Deployment Guide - Vercel (Frontend) + Render (Backend)

This guide will help you deploy the frontend to Vercel and backend to Render without errors.

## 📋 Prerequisites

- GitHub repository with all code pushed
- Vercel account ([vercel.com](https://vercel.com))
- Render account ([render.com](https://render.com))
- Production PostgreSQL database (Supabase/Neon/Railway)
- Vanna AI service deployed (Render/Railway/etc.)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository

### Step 2: Configure Project Settings

**Project Settings:**
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web` (IMPORTANT!)
- **Build Command**: `npm install && npm run build` (runs in apps/web)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

**OR use the `vercel.json` file** (already created in root):
- Vercel will automatically detect and use `vercel.json`

### Step 3: Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_BASE=https://your-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
```

**Important**: 
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Replace `your-backend.onrender.com` with your actual Render backend URL
- Replace `your-frontend.vercel.app` with your actual Vercel URL

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Get your frontend URL: `https://your-app.vercel.app`

---

## ⚙️ Backend Deployment (Render)

### Step 1: Create Web Service on Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository

### Step 2: Configure Service Settings

**Basic Settings:**
- **Name**: `flowbit-api` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Root Directory**: `apps/api` (IMPORTANT!)

**Build & Deploy:**
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`

**OR use the `render.yaml` file** (already created in root):
- Render will automatically detect and use `render.yaml`

### Step 3: Add Environment Variables

In Render Dashboard → Environment:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
VANNA_API_BASE_URL=https://your-vanna.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app
```

**Important**:
- `DATABASE_URL`: Your production PostgreSQL connection string
- `VANNA_API_BASE_URL`: Your Vanna AI service URL
- `FRONTEND_URL`: Your Vercel frontend URL (for CORS)
- `PORT`: Render uses port 10000 (or check your service settings)

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for build to complete
3. Get your backend URL: `https://your-api.onrender.com`

---

## 🔧 Post-Deployment Setup

### 1. Update Environment Variables

After both services are deployed:

**Update Frontend (Vercel):**
- Go to Vercel Dashboard → Settings → Environment Variables
- Update `NEXT_PUBLIC_API_BASE` with your Render backend URL
- Redeploy if needed

**Update Backend (Render):**
- Go to Render Dashboard → Environment
- Update `FRONTEND_URL` with your Vercel frontend URL
- Update `VANNA_API_BASE_URL` with your Vanna AI URL
- Service will auto-redeploy

### 2. Set Up Database

**On Production Database:**
```bash
# Connect to your production database
# Then run migrations
cd apps/api
npx prisma migrate deploy

# Seed the database
npx prisma db seed
```

**OR use Render's shell:**
1. Go to Render Dashboard → Your Service → Shell
2. Run:
```bash
cd apps/api
npx prisma migrate deploy
npx prisma db seed
```

### 3. Test Deployment

**Test Frontend:**
- Visit: `https://your-frontend.vercel.app`
- Check if dashboard loads
- Check browser console for errors

**Test Backend:**
- Visit: `https://your-api.onrender.com/health`
- Should return: `{"status":"ok","timestamp":"..."}`

**Test API Endpoints:**
- `https://your-api.onrender.com/api/stats`
- `https://your-api.onrender.com/api/invoice-trends`

---

## 🐛 Common Deployment Issues & Fixes

### Issue 1: Frontend Can't Connect to Backend

**Error**: `Failed to fetch` or CORS errors

**Fix**:
1. Check `NEXT_PUBLIC_API_BASE` in Vercel matches your Render backend URL
2. Check `FRONTEND_URL` in Render matches your Vercel frontend URL
3. Ensure CORS is configured correctly in backend

### Issue 2: Backend Build Fails

**Error**: `Prisma Client not generated` or `Cannot find module`

**Fix**:
1. Ensure build command includes: `npx prisma generate`
2. Check `package.json` has `postinstall` script: `"postinstall": "prisma generate"`
3. Verify `DATABASE_URL` is set in Render environment variables

### Issue 3: Database Connection Error

**Error**: `Can't reach database server`

**Fix**:
1. Verify `DATABASE_URL` is correct in Render
2. Check database firewall allows Render IPs
3. For Supabase/Neon: Check connection pooling settings
4. Ensure database is running and accessible

### Issue 4: Port Already in Use (Render)

**Error**: `Port 3001 already in use`

**Fix**:
- Render uses `PORT` environment variable (usually 10000)
- Backend is configured to use `process.env.PORT || 3001`
- This should work automatically

### Issue 5: Vanna AI Connection Error

**Error**: `Failed to process query` or connection timeout

**Fix**:
1. Verify `VANNA_API_BASE_URL` in Render is correct
2. Ensure Vanna AI service is deployed and running
3. Check Vanna AI service URL is accessible
4. Verify CORS is enabled on Vanna AI service

---

## ✅ Deployment Checklist

### Before Deploying:

- [ ] All code is pushed to GitHub
- [ ] `.gitignore` is correct (no secrets committed)
- [ ] Production database is set up
- [ ] Vanna AI service is deployed (or ready to deploy)

### Frontend (Vercel):

- [ ] Repository connected
- [ ] Root directory set to `apps/web`
- [ ] Environment variables set:
  - [ ] `NEXT_PUBLIC_API_BASE`
  - [ ] `NEXT_PUBLIC_APP_URL`
- [ ] Build successful
- [ ] Frontend URL accessible

### Backend (Render):

- [ ] Repository connected
- [ ] Root directory set to `apps/api`
- [ ] Build command: `npm install && npx prisma generate && npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables set:
  - [ ] `DATABASE_URL`
  - [ ] `VANNA_API_BASE_URL`
  - [ ] `FRONTEND_URL`
  - [ ] `PORT=10000`
  - [ ] `NODE_ENV=production`
- [ ] Build successful
- [ ] Backend URL accessible
- [ ] `/health` endpoint works

### After Deployment:

- [ ] Database migrations run: `npx prisma migrate deploy`
- [ ] Database seeded: `npx prisma db seed`
- [ ] Frontend can connect to backend
- [ ] All API endpoints work
- [ ] Chat with Data feature works
- [ ] CORS is configured correctly

---

## 🔗 URL Configuration

After deployment, update these URLs:

### Frontend (Vercel):
```
NEXT_PUBLIC_API_BASE=https://your-api.onrender.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Backend (Render):
```
FRONTEND_URL=https://your-app.vercel.app
VANNA_API_BASE_URL=https://your-vanna.onrender.com
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

## 📝 Quick Reference

### Vercel Deployment:
- **Root Directory**: `apps/web`
- **Build Command**: `npm install && npm run build`
- **Framework**: Next.js

### Render Deployment:
- **Root Directory**: `apps/api`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`
- **Port**: Uses `PORT` environment variable (10000)

---

## 🎉 You're Ready to Deploy!

Follow the steps above, and your application will be live on:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`

Good luck with your deployment! 🚀


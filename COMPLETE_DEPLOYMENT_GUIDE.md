# 🚀 Complete Deployment Guide - Backend & Vanna AI

This guide will help you deploy your **Backend API** and **Vanna AI Service** to Render, and connect everything together.

**Your Frontend:** ✅ Already deployed at `https://flowbit-ai-web.vercel.app/`

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ GitHub repository with all code pushed
- ✅ Neon PostgreSQL database (or any PostgreSQL database)
- ✅ Groq API key ([Get one here](https://console.groq.com/))
- ✅ Render account ([Sign up here](https://render.com))

---

## Part 1: Deploy Backend API to Render

### Step 1: Create Backend Service in Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository: **"Flowbit-Ai"** (or your repo name)
5. Click **"Connect"**

### Step 2: Configure Backend Service

**Basic Settings:**
- **Name:** `flowbit-api` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `master` (or `main`)
- **Root Directory:** `apps/api` ⚠️ **IMPORTANT**
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** `Free` (or choose paid plan)

**Click "Create Web Service"**

### Step 3: Set Environment Variables for Backend

After the service is created, go to **"Environment"** tab and add:

#### Required Variables:

1. **NODE_ENV**
   - Value: `production`

2. **DATABASE_URL** ⚠️ **CRITICAL**
   - Value: Your Neon PostgreSQL connection string
   - Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
   - Get this from your Neon dashboard
   - Example: `postgresql://user:pass@ep-xxx-xxx.us-east-2.aws.neon.tech/flowbit_analytics?sslmode=require`

3. **VANNA_API_BASE_URL** ⚠️ **CRITICAL**
   - Value: `https://your-vanna-service-name.onrender.com`
   - **Note:** You'll set this after deploying Vanna service
   - For now, use a placeholder: `https://flowbit-vanna.onrender.com`
   - **Important:** No trailing slash!

4. **FRONTEND_URL** ⚠️ **CRITICAL for CORS**
   - Value: `https://flowbit-ai-web.vercel.app`
   - This is your deployed frontend URL
   - **Important:** No trailing slash!

5. **PORT**
   - **Don't set this** - Render sets it automatically

**Click "Save Changes"** - Service will auto-restart

### Step 4: Run Database Migrations

After backend is deployed:

1. Go to your backend service in Render
2. Click **"Shell"** tab
3. Run:
   ```bash
   npm run migrate:deploy
   ```
4. This will create all database tables

### Step 5: (Optional) Seed Database

If you want sample data:

1. In the Shell, run:
   ```bash
   npm run db:seed
   ```
   (Note: You may need to adjust this command based on your package.json)

---

## Part 2: Deploy Vanna AI Service to Render

### Step 1: Create Vanna Service in Render

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Select the same repository: **"Flowbit-Ai"**
3. Click **"Connect"**

### Step 2: Configure Vanna Service

**Basic Settings:**
- **Name:** `flowbit-vanna` (or your preferred name)
- **Region:** Same as backend (recommended)
- **Branch:** `master` (or `main`)
- **Root Directory:** `services/vanna` ⚠️ **IMPORTANT**
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan:** `Free` (or choose paid plan)

**Click "Create Web Service"**

### Step 3: Set Environment Variables for Vanna

Go to **"Environment"** tab and add:

#### Required Variables:

1. **DATABASE_URL** ⚠️ **CRITICAL**
   - Value: **Same Neon connection string as backend**
   - Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
   - Must be the same database as backend

2. **GROQ_API_KEY** ⚠️ **CRITICAL**
   - Value: Your Groq API key
   - Get from: https://console.groq.com/
   - Format: `gsk_xxxxxxxxxxxxxxxxxxxxx`

3. **PORT**
   - **Don't set this** - Render sets it automatically

**Click "Save Changes"** - Service will auto-restart

### Step 4: Verify Vanna Service

1. Wait for deployment to complete
2. Your Vanna service URL will be: `https://flowbit-vanna.onrender.com`
3. Test it:
   ```bash
   curl https://flowbit-vanna.onrender.com/health
   ```
4. Should return:
   ```json
   {
     "service": "vanna-ai",
     "status": "ok",
     "database_configured": true,
     "groq_configured": true,
     "database_connected": true
   }
   ```

---

## Part 3: Connect Everything Together

### Step 1: Update Backend with Vanna URL

1. Go to **Backend Service** in Render
2. Click **"Environment"** tab
3. Update **VANNA_API_BASE_URL**:
   - Value: `https://flowbit-vanna.onrender.com` (your actual Vanna URL)
   - **Important:** No trailing slash!
4. Click **"Save Changes"**

### Step 2: Update Frontend with Backend URL

1. Go to **Vercel Dashboard** → Your Frontend Project
2. Click **"Settings"** → **"Environment Variables"**
3. Add/Update **NEXT_PUBLIC_API_BASE**:
   - Value: `https://flowbit-api.onrender.com` (your actual backend URL)
   - **Important:** No trailing slash!
4. Click **"Save"**
5. **Redeploy** frontend (Vercel will auto-redeploy or click "Redeploy")

---

## Part 4: Final Configuration Checklist

### ✅ Backend Service (Render)

- [ ] Service is "Live" and running
- [ ] Root Directory: `apps/api`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Environment Variables:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` = Neon connection string
  - [ ] `VANNA_API_BASE_URL` = Vanna service URL
  - [ ] `FRONTEND_URL` = `https://flowbit-ai-web.vercel.app`
- [ ] Database migrations run (`npm run migrate:deploy`)
- [ ] Test: `https://your-backend-url.onrender.com/health` returns `{"status":"ok"}`

### ✅ Vanna Service (Render)

- [ ] Service is "Live" and running
- [ ] Root Directory: `services/vanna`
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Environment Variables:
  - [ ] `DATABASE_URL` = Neon connection string (same as backend)
  - [ ] `GROQ_API_KEY` = Your Groq API key
- [ ] Test: `https://your-vanna-url.onrender.com/health` returns status ok

### ✅ Frontend (Vercel)

- [ ] Root Directory: `apps/web`
- [ ] Environment Variables:
  - [ ] `NEXT_PUBLIC_API_BASE` = Backend URL
- [ ] Test: Frontend loads at `https://flowbit-ai-web.vercel.app`

---

## Part 5: Testing Your Deployment

### Test 1: Backend Health Check

```bash
curl https://your-backend-url.onrender.com/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

### Test 2: Vanna Health Check

```bash
curl https://your-vanna-url.onrender.com/health
```

**Expected:** All checks should be `true`

### Test 3: Backend API Endpoints

```bash
# Test stats
curl https://your-backend-url.onrender.com/api/stats

# Test chat (should connect to Vanna)
curl -X POST https://your-backend-url.onrender.com/api/chat-with-data \
  -H "Content-Type: application/json \
  -d '{"query":"How many invoices are there?"}'
```

### Test 4: Frontend Integration

1. Open `https://flowbit-ai-web.vercel.app`
2. Check browser console (F12) for errors
3. Test dashboard - should load data
4. Test chat feature - should work end-to-end

---

## Part 6: Troubleshooting

### Issue: Backend Returns 502

**Check:**
- Service is "Live" in Render
- Environment variables are set
- Check logs for errors

### Issue: Vanna Returns 502

**Check:**
- `DATABASE_URL` is set correctly
- `GROQ_API_KEY` is set correctly
- Check logs for specific errors

### Issue: "Failed to fetch" in Frontend

**Check:**
- `NEXT_PUBLIC_API_BASE` is set in Vercel
- Backend `FRONTEND_URL` matches frontend URL exactly
- CORS is configured correctly

### Issue: Chat Feature Doesn't Work

**Check:**
- Backend `VANNA_API_BASE_URL` is set correctly
- Vanna service is running
- Test Vanna directly first

---

## Part 7: Service URLs Summary

After deployment, you should have:

- **Frontend:** `https://flowbit-ai-web.vercel.app` ✅ (Already deployed)
- **Backend:** `https://flowbit-api.onrender.com` (or your name)
- **Vanna:** `https://flowbit-vanna.onrender.com` (or your name)
- **Database:** Neon PostgreSQL (connection string)

---

## 🎉 Success!

Once all services are deployed and configured:

1. ✅ Frontend loads without errors
2. ✅ Dashboard displays data
3. ✅ Chat with Data feature works
4. ✅ All API endpoints respond correctly
5. ✅ No CORS errors
6. ✅ All services are "Live"

Your project is now ready for submission! 🚀

---

## 📝 Quick Reference

### Backend Service Settings:
```
Root Directory: apps/api
Build Command: npm install && npm run build
Start Command: npm start
```

### Vanna Service Settings:
```
Root Directory: services/vanna
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables Quick List:

**Backend:**
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://...`
- `VANNA_API_BASE_URL=https://flowbit-vanna.onrender.com`
- `FRONTEND_URL=https://flowbit-ai-web.vercel.app`

**Vanna:**
- `DATABASE_URL=postgresql://...` (same as backend)
- `GROQ_API_KEY=gsk_...`

**Frontend:**
- `NEXT_PUBLIC_API_BASE=https://flowbit-api.onrender.com`

---

Need help? Check the logs in Render Dashboard for specific error messages!


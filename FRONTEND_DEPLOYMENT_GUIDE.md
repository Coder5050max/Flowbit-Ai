# 🚀 Complete Frontend Deployment Guide - Vercel

This guide will walk you through deploying your Next.js frontend to Vercel from scratch.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Your code pushed to GitHub
- ✅ A Vercel account (sign up at https://vercel.com if needed)
- ✅ Your backend API URL (from Render)
- ✅ Your Vanna service URL (from Render)

---

## Step 1: Connect Your GitHub Repository to Vercel

### 1.1 Sign in to Vercel
1. Go to https://vercel.com
2. Sign in with your GitHub account (recommended) or create an account
3. You'll be taken to the Vercel Dashboard

### 1.2 Import Your Project
1. Click the **"Add New..."** button (top right)
2. Select **"Project"**
3. You'll see a list of your GitHub repositories
4. Find and click on your **"Flowbit AI"** repository (or whatever you named it)
5. Click **"Import"**

---

## Step 2: Configure Project Settings

### 2.1 Project Name
- Vercel will auto-suggest a name (e.g., "flowbit-ai")
- You can change it if you want
- Click **"Continue"**

### 2.2 Framework Preset
- Vercel should auto-detect **Next.js**
- If not, select **"Next.js"** from the dropdown
- Click **"Continue"**

### 2.3 Root Directory Configuration ⚠️ **IMPORTANT**

Since this is a monorepo, you need to set the root directory:

1. Click **"Configure Project"** or look for **"Root Directory"** option
2. Click **"Edit"** next to Root Directory
3. Select **"Other"** or manually enter: `apps/web`
4. This tells Vercel to deploy only the `apps/web` folder

### 2.4 Build and Output Settings

**Build Command:**
```
npm install && npm run build
```

**Output Directory:**
```
.next
```
(Usually auto-detected, but verify)

**Install Command:**
```
npm install
```
(Usually auto-detected)

**Node.js Version:**
- Select **18.x** or **20.x** (recommended: 20.x)

---

## Step 3: Set Environment Variables ⚠️ **CRITICAL**

Before deploying, you MUST set these environment variables:

### 3.1 Add Environment Variables

1. In the project configuration page, scroll down to **"Environment Variables"**
2. Click **"Add"** or **"Add Variable"**

### 3.2 Required Variables

Add these one by one:

#### Variable 1: `NEXT_PUBLIC_API_BASE`
- **Key:** `NEXT_PUBLIC_API_BASE`
- **Value:** `https://your-backend-url.onrender.com`
  - Replace `your-backend-url` with your actual Render backend URL
  - Example: `https://flowbit-api.onrender.com`
- **Environment:** Select all (Production, Preview, Development)
- **Important:** No trailing slash!

#### Variable 2: `NEXT_PUBLIC_APP_URL` (Optional but recommended)
- **Key:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://your-app-name.vercel.app`
  - This will be your Vercel URL (you'll know it after first deploy)
  - Or use a custom domain if you have one
- **Environment:** Select all

### 3.3 Verify Variables

After adding, you should see:
```
NEXT_PUBLIC_API_BASE = https://your-backend-url.onrender.com
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
```

---

## Step 4: Deploy

### 4.1 Start Deployment
1. Review all settings
2. Click **"Deploy"** button
3. Vercel will start building your project

### 4.2 Watch the Build
- You'll see the build logs in real-time
- Wait for the build to complete (usually 2-5 minutes)
- If build fails, check the error messages

### 4.3 Build Success
- You'll see "Build Completed"
- Vercel will provide you with a URL like: `https://your-app-name.vercel.app`

---

## Step 5: Post-Deployment Configuration

### 5.1 Update Backend CORS Settings

After deployment, you need to update your backend to allow your frontend URL:

1. Go to **Render Dashboard** → Your Backend Service
2. Click **"Environment"** tab
3. Find or add `FRONTEND_URL`
4. Set it to your Vercel URL: `https://your-app-name.vercel.app`
5. Click **"Save Changes"**
6. Backend will automatically restart

### 5.2 Verify Environment Variables

In Vercel:
1. Go to your project → **"Settings"** → **"Environment Variables"**
2. Verify all variables are set correctly
3. If you need to update, click **"Edit"** and save
4. Redeploy if you made changes

---

## Step 6: Test Your Deployment

### 6.1 Basic Test
1. Open your Vercel URL: `https://your-app-name.vercel.app`
2. The page should load without errors
3. Check browser console (F12) for any errors

### 6.2 Test Dashboard
1. Navigate to the dashboard
2. Check if data loads (if you have data in database)
3. Verify charts render correctly

### 6.3 Test Chat Feature
1. Go to the Chat page
2. Try a query: "How many invoices are there?"
3. Check if it works (may need backend/Vanna configured)

### 6.4 Check Network Requests
1. Open browser DevTools (F12)
2. Go to **"Network"** tab
3. Try using the app
4. Check if API calls are going to your backend URL
5. Look for any failed requests

---

## Step 7: Troubleshooting

### Issue 1: Build Fails

**Common causes:**
- Missing dependencies
- TypeScript errors
- Build configuration issues

**Fix:**
1. Check build logs in Vercel
2. Look for specific error messages
3. Fix errors locally first
4. Push changes and redeploy

### Issue 2: "Failed to Fetch" Error

**Cause:** `NEXT_PUBLIC_API_BASE` not set or incorrect

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_BASE` is set correctly
3. Make sure it's your backend URL (no trailing slash)
4. Redeploy after updating

### Issue 3: CORS Errors

**Cause:** Backend `FRONTEND_URL` doesn't match frontend URL

**Fix:**
1. Check your Vercel URL
2. Update `FRONTEND_URL` in Render backend
3. Restart backend service

### Issue 4: Page Not Found (404)

**Cause:** Root directory not set correctly

**Fix:**
1. Go to Vercel → Settings → General
2. Check "Root Directory" is set to `apps/web`
3. Redeploy

---

## Step 8: Custom Domain (Optional)

If you want to use a custom domain:

1. Go to Vercel → Your Project → **"Settings"** → **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_APP_URL` and backend `FRONTEND_URL` with new domain

---

## Step 9: Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. **Production:** Deploys from `main` or `master` branch
2. **Preview:** Creates preview deployments for pull requests
3. **Automatic:** No manual deployment needed after initial setup

### To update your site:
1. Make changes to your code
2. Commit and push to GitHub
3. Vercel automatically builds and deploys
4. You'll get a notification when deployment completes

---

## 📝 Quick Reference Checklist

Before deploying, ensure:
- [ ] Code is pushed to GitHub
- [ ] Root directory set to `apps/web`
- [ ] `NEXT_PUBLIC_API_BASE` environment variable set
- [ ] `NEXT_PUBLIC_APP_URL` environment variable set (optional)
- [ ] Build command: `npm install && npm run build`
- [ ] Node.js version: 18.x or 20.x

After deployment:
- [ ] Frontend loads without errors
- [ ] Dashboard displays correctly
- [ ] API calls work (check Network tab)
- [ ] Backend `FRONTEND_URL` updated with Vercel URL
- [ ] Chat feature works (if backend/Vanna configured)

---

## 🔗 Important URLs to Note

After deployment, save these:
- **Frontend URL:** `https://your-app-name.vercel.app`
- **Backend URL:** `https://your-backend-url.onrender.com`
- **Vanna URL:** `https://your-vanna-url.onrender.com`

You'll need these for environment variable configuration.

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel build logs for specific errors
2. Check browser console (F12) for frontend errors
3. Verify all environment variables are set
4. Check that backend and Vanna services are running
5. Review the troubleshooting section above

---

## 🎉 Success!

Once deployed, your frontend will be live at your Vercel URL. Any changes you push to GitHub will automatically trigger a new deployment.

Happy deploying! 🚀


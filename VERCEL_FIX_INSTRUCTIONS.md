# ⚠️ VERCEL DEPLOYMENT FIX - Turbo Build Error

## 🔴 Error You're Seeing
```
Error: Command "turbo run build" exited with 1
```

## ✅ SOLUTION (2 Steps)

### Step 1: Set Root Directory in Vercel Dashboard

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** tab
3. Scroll to **General** section
4. Find **Root Directory**
5. Click **Edit**
6. Enter: `apps/web`
7. Click **Save**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger redeploy

---

## 🎯 Why This Fixes It

**Before (Wrong):**
- Vercel uses root `package.json`
- Sees `"build": "turbo run build"`
- Tries to run Turbo → **FAILS**

**After (Correct):**
- Vercel uses `apps/web/package.json`
- Sees `"build": "next build"`
- Runs Next.js build → **SUCCESS**

---

## 📋 Vercel Settings Summary

**Root Directory**: `apps/web` ⚠️ **MUST SET THIS!**

**Everything else auto-detects:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

**Environment Variables:**
```
NEXT_PUBLIC_API_BASE=https://your-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
```

---

## ✅ After Fix

Your build should now:
1. ✅ Install dependencies in `apps/web`
2. ✅ Run `next build`
3. ✅ Deploy successfully

---

**That's it! Just set Root Directory to `apps/web` and redeploy.** 🚀


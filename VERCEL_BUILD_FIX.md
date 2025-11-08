# 🔧 Vercel Build Error Fix Guide

## Issue: Build Failed with Webpack Errors

If you're getting build errors on Vercel, follow these steps:

---

## Step 1: Verify Vercel Project Settings

### Root Directory
1. Go to Vercel Dashboard → Your Project → **Settings** → **General**
2. Verify **Root Directory** is set to: `apps/web`
3. If not, set it and save

### Build & Development Settings
1. Go to **Settings** → **General** → **Build & Development Settings**
2. Verify these settings:

**Framework Preset:** `Next.js`

**Root Directory:** `apps/web`

**Build Command:** `npm install && npm run build`
- Or just: `npm run build` (if install is automatic)

**Output Directory:** `.next` (auto-detected, but verify)

**Install Command:** `npm install`

**Node.js Version:** `20.x` (recommended) or `18.x`

---

## Step 2: Check for TypeScript Errors Locally

Before deploying, test the build locally:

```bash
cd apps/web
npm install
npm run build
```

If this fails locally, fix the errors first before deploying.

Common issues:
- TypeScript type errors
- Missing imports
- Syntax errors

---

## Step 3: Common Build Issues & Fixes

### Issue 1: Module Not Found

**Error:** `Module not found: Can't resolve '...'`

**Fix:**
- Check if all dependencies are in `package.json`
- Run `npm install` locally to verify
- Check import paths are correct

### Issue 2: TypeScript Errors

**Error:** `Type error: ...`

**Fix:**
- Fix TypeScript errors locally first
- Check `tsconfig.json` is correct
- Verify all types are properly defined

### Issue 3: Path Alias Issues

**Error:** `Cannot find module '@/...'`

**Fix:**
- Verify `tsconfig.json` has correct paths:
  ```json
  "paths": {
    "@/*": ["./*"]
  }
  ```
- Check `next.config.js` webpack config

### Issue 4: Environment Variables at Build Time

**Error:** Build fails when accessing `process.env`

**Fix:**
- Only use `NEXT_PUBLIC_*` variables in client components
- Don't access server-only env vars in client code
- Set all `NEXT_PUBLIC_*` variables in Vercel before building

---

## Step 4: Vercel Build Command Options

### Option A: Simple (Recommended)
If Root Directory is set to `apps/web`:

**Build Command:** `npm run build`

**Install Command:** `npm install`

### Option B: From Root (If Option A doesn't work)
If building from repository root:

**Root Directory:** (leave empty or set to `/`)

**Build Command:** `cd apps/web && npm install && npm run build`

**Install Command:** `npm install`

---

## Step 5: Check Build Logs

1. Go to Vercel Dashboard → Your Project
2. Click on the failed deployment
3. Click **"View Build Logs"**
4. Look for specific error messages
5. Common error locations:
   - TypeScript compilation errors
   - Module resolution errors
   - Missing dependencies
   - Webpack configuration issues

---

## Step 6: Temporary Fixes (If Needed)

### Allow Build with TypeScript Errors (Temporary)

In `apps/web/next.config.js`:
```javascript
typescript: {
  ignoreBuildErrors: true, // Only for debugging!
},
eslint: {
  ignoreDuringBuilds: true, // Only for debugging!
},
```

**⚠️ Warning:** Only use this to identify the issue. Fix the actual errors afterward.

---

## Step 7: Clean Build

Sometimes cached builds cause issues:

1. In Vercel → Your Project → **Deployments**
2. Click the three dots (⋯) on latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"** = OFF
5. Click **"Redeploy"**

---

## Step 8: Verify Dependencies

Make sure all dependencies are in `package.json`:

```bash
cd apps/web
npm install
npm run build
```

If local build works but Vercel fails, check:
- Node.js version mismatch
- Missing environment variables
- Build command differences

---

## Quick Checklist

Before deploying:
- [ ] Root Directory set to `apps/web` in Vercel
- [ ] Build command: `npm run build` (or `npm install && npm run build`)
- [ ] Local build works: `cd apps/web && npm run build`
- [ ] All dependencies in `package.json`
- [ ] TypeScript compiles without errors
- [ ] Environment variables set in Vercel
- [ ] No syntax errors in code

---

## Most Common Fix

**90% of build failures are fixed by:**

1. Setting **Root Directory** to `apps/web` in Vercel
2. Using build command: `npm run build`
3. Ensuring local build works first

---

## Still Having Issues?

1. **Check build logs** in Vercel for specific error messages
2. **Test locally first:** `cd apps/web && npm run build`
3. **Compare** local vs Vercel Node.js versions
4. **Verify** all environment variables are set
5. **Check** for any missing dependencies

Share the specific error message from Vercel build logs for more targeted help!


# 🔧 Fix Vercel Build Error - Module Not Found

## Error You're Seeing
```
Module not found: Can't resolve '@/components/sidebar'
Build failed because of webpack errors
```

## ✅ Solution

I've updated the configuration files. Now you need to update your Vercel project settings:

### **Option 1: Use Root Directory (Recommended)**

1. **Go to your Vercel project** → **Settings** → **General**
2. **Scroll to "Root Directory"**
3. **Set it to:** `apps/web` (if not already set)
4. **Go to "Build & Development Settings"**
5. **Update these settings:**
   - **Install Command:** `cd ../.. && npm install`
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** `.next` (or leave default)
6. **Save and Redeploy**

### **Option 2: Build from Root (Alternative)**

1. **Go to Settings** → **General**
2. **Remove/clear the "Root Directory"** (set to empty or root `/`)
3. **The root `vercel.json` will handle the build**
4. **Save and Redeploy**

---

## 📝 What I Fixed

1. ✅ Created `apps/web/vercel.json` with proper install command
2. ✅ Updated root `vercel.json` for monorepo support
3. ✅ Updated `next.config.js` to ensure webpack config is correct

---

## 🚀 After Fixing

1. **Commit and push the changes:**
   ```bash
   git push origin master
   ```

2. **In Vercel Dashboard:**
   - Go to **Deployments** tab
   - Click **"..."** on the latest deployment
   - Click **"Redeploy"**

3. **Or trigger a new deployment:**
   - Make a small change and push, or
   - Click **"Redeploy"** in Vercel

---

## ⚠️ Important Notes

- The **Install Command** must install from the **root** (`cd ../.. && npm install`) to set up the monorepo workspace
- The **Build Command** runs from `apps/web` directory (when Root Directory is set)
- Make sure **Root Directory** is set to `apps/web` in Vercel settings

---

## 🔍 If Still Not Working

If you still get errors, try:

1. **Clear Vercel build cache:**
   - Settings → General → Clear Build Cache

2. **Check the build logs** in Vercel to see the exact error

3. **Verify the path alias** is working:
   - The `@/*` alias should resolve to `apps/web/*` when Root Directory is `apps/web`

---

**Try Option 1 first (with Root Directory = `apps/web` and Install Command = `cd ../.. && npm install`). This should fix the build error!**


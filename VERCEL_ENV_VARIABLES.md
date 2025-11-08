# 📝 How to Add Environment Variables in Vercel

## Step-by-Step Guide

### **During Initial Project Setup:**

1. **Go to Vercel Dashboard** → [vercel.com](https://vercel.com)
2. **Click "Add New Project"**
3. **Import your GitHub repository** (`Coder5050max/Flowbit-Ai`)
4. **On the "Configure Project" page**, scroll down to find:
   - **Root Directory**: Set to `apps/web` ⚠️ **IMPORTANT**
   - **Framework Preset**: Should auto-detect "Next.js"
   - **Build Command**: Leave default (or `npm run build`)
   - **Output Directory**: Leave default (`.next`)
5. **Scroll down to "Environment Variables" section**
6. **Click "Add" or the "+" button** next to Environment Variables
7. **Add these variables one by one:**

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `NEXT_PUBLIC_API_BASE` | `http://localhost:3001` | Production, Preview, Development |
   | `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Production, Preview, Development |

   **For each variable:**
   - Enter the **Key** (e.g., `NEXT_PUBLIC_API_BASE`)
   - Enter the **Value** (e.g., `http://localhost:3001`)
   - Select **Environment(s)**: Check all three boxes (Production, Preview, Development)
   - Click **"Add"** or **"Save"**

8. **Click "Deploy"** at the bottom

---

### **After Project is Created (To Update Variables):**

1. **Go to your project** in Vercel Dashboard
2. **Click on "Settings"** tab (top navigation)
3. **Click on "Environment Variables"** (left sidebar)
4. **Click "Add New"** button
5. **Add each variable** as described above
6. **After adding/updating**, you need to **redeploy**:
   - Go to **"Deployments"** tab
   - Click the **"..."** (three dots) on the latest deployment
   - Click **"Redeploy"**

---

## 🔄 Important: Update After Getting Backend URL

**After you deploy your backend on Render**, you'll get a URL like:
- `https://your-api.onrender.com`

**Then update the Vercel environment variable:**

1. Go to **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_API_BASE`
3. Click **"Edit"** (pencil icon)
4. Change value to: `https://your-api.onrender.com`
5. Click **"Save"**
6. **Redeploy** your frontend (Deployments → ... → Redeploy)

---

## 📸 Visual Guide

The Environment Variables section looks like this:

```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ Key                    Value            │
│ ┌─────────────────────────────────────┐ │
│ │ NEXT_PUBLIC_API_BASE                │ │
│ │ http://localhost:3001               │ │
│ │ ☑ Production ☑ Preview ☑ Development│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [+ Add New]                             │
└─────────────────────────────────────────┘
```

---

## ✅ Quick Checklist

- [ ] Set Root Directory to `apps/web`
- [ ] Add `NEXT_PUBLIC_API_BASE` = `http://localhost:3001` (temporary)
- [ ] Add `NEXT_PUBLIC_APP_URL` = `http://localhost:3000` (temporary)
- [ ] Select all environments (Production, Preview, Development)
- [ ] Click Deploy
- [ ] After backend is deployed, update `NEXT_PUBLIC_API_BASE` to Render URL
- [ ] Redeploy frontend

---

**Note:** The `NEXT_PUBLIC_` prefix is required for Next.js to expose these variables to the browser!


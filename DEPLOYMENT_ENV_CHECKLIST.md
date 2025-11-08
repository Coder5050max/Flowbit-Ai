# 🔧 Environment Variables Checklist for Deployment

## Critical: Fix "Failed to Fetch" Error

The "failed to fetch" error is usually caused by missing or incorrect environment variables. Follow this checklist:

---

## ✅ Frontend (Vercel)

### Required Environment Variables:

1. **NEXT_PUBLIC_API_BASE**
   - **Value:** Your backend Render URL
   - **Format:** `https://your-backend-name.onrender.com`
   - **Example:** `https://flowbit-api.onrender.com`
   - **Important:** No trailing slash!

2. **NEXT_PUBLIC_APP_URL** (Optional but recommended)
   - **Value:** Your frontend Vercel URL
   - **Format:** `https://your-app.vercel.app`
   - **Example:** `https://flowbit-ai.vercel.app`

**How to set in Vercel:**
1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add `NEXT_PUBLIC_API_BASE` with your backend URL
4. Click "Save"
5. **Redeploy** your frontend (Vercel will auto-redeploy)

---

## ✅ Backend (Render)

### Required Environment Variables:

1. **NODE_ENV**
   - **Value:** `production`
   - Already set in `render.yaml`

2. **DATABASE_URL**
   - **Value:** Your Neon PostgreSQL connection string
   - **Format:** `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
   - Get this from your Neon dashboard

3. **VANNA_API_BASE_URL** ⚠️ **CRITICAL**
   - **Value:** Your Vanna service Render URL
   - **Format:** `https://your-vanna-name.onrender.com`
   - **Example:** `https://flowbit-vanna.onrender.com`
   - **Important:** No trailing slash!
   - **This is likely missing and causing the issue!**

4. **FRONTEND_URL** ⚠️ **CRITICAL for CORS**
   - **Value:** Your frontend Vercel URL
   - **Format:** `https://your-app.vercel.app`
   - **Example:** `https://flowbit-ai.vercel.app`
   - **Important:** No trailing slash!
   - **If this is wrong, CORS will block requests!**

5. **PORT**
   - Auto-set by Render (usually 10000)
   - Don't set manually

**How to set in Render:**
1. Go to your backend service in Render Dashboard
2. Click "Environment" tab
3. Add/verify all variables above
4. Click "Save Changes"
5. Service will auto-restart

---

## ✅ Vanna Service (Render)

### Required Environment Variables:

1. **DATABASE_URL**
   - **Value:** Same Neon connection string as backend
   - **Format:** `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

2. **GROQ_API_KEY**
   - **Value:** Your Groq API key
   - Get from: https://console.groq.com/

3. **PORT**
   - Auto-set by Render
   - Don't set manually

---

## 🔍 Quick Diagnostic Steps

### Step 1: Check Frontend Configuration

Open browser console (F12) and check:
```javascript
// Should show your backend URL, not localhost
console.log(process.env.NEXT_PUBLIC_API_BASE);
```

If it shows `http://localhost:3001`, the environment variable is not set in Vercel.

### Step 2: Test Backend Directly

```bash
# Test backend health
curl https://your-backend-url.onrender.com/health

# Test chat endpoint
curl -X POST https://your-backend-url.onrender.com/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

### Step 3: Check CORS

Open browser console and look for CORS errors:
- `Access-Control-Allow-Origin` error = `FRONTEND_URL` is wrong
- `Failed to fetch` = Network/CORS issue

### Step 4: Check Backend Logs

In Render Dashboard → Backend Service → Logs:
- Look for "CORS blocked origin" warnings
- Look for "Vanna API error" messages
- Check if `VANNA_API_BASE_URL` is being used correctly

---

## 🐛 Common Issues

### Issue 1: "Failed to fetch" in Browser

**Causes:**
- `NEXT_PUBLIC_API_BASE` not set in Vercel
- Backend URL is incorrect
- CORS blocking (check `FRONTEND_URL`)

**Fix:**
1. Set `NEXT_PUBLIC_API_BASE` in Vercel
2. Verify `FRONTEND_URL` in backend matches frontend URL exactly
3. Redeploy frontend

---

### Issue 2: CORS Error

**Error:** `Access-Control-Allow-Origin`

**Causes:**
- `FRONTEND_URL` in backend doesn't match actual frontend URL
- Trailing slash mismatch
- Protocol mismatch (http vs https)

**Fix:**
1. Check `FRONTEND_URL` in Render backend
2. Must match exactly: `https://your-app.vercel.app` (no trailing slash)
3. Restart backend service

---

### Issue 3: Backend Can't Reach Vanna

**Error:** "Failed to process query" or "Vanna API error"

**Causes:**
- `VANNA_API_BASE_URL` not set in backend
- Wrong Vanna URL
- Vanna service not running

**Fix:**
1. Set `VANNA_API_BASE_URL` in backend Render environment
2. Verify Vanna service is running
3. Test Vanna directly: `curl https://your-vanna-url.onrender.com/health`

---

## ✅ Verification Checklist

After setting all variables:

- [ ] Frontend has `NEXT_PUBLIC_API_BASE` set to backend URL
- [ ] Backend has `VANNA_API_BASE_URL` set to Vanna URL
- [ ] Backend has `FRONTEND_URL` set to frontend URL (exact match, no trailing slash)
- [ ] Backend has `DATABASE_URL` set to Neon connection string
- [ ] Vanna has `DATABASE_URL` set to Neon connection string
- [ ] Vanna has `GROQ_API_KEY` set
- [ ] All services are "Live" in Render/Vercel
- [ ] Test backend health endpoint works
- [ ] Test Vanna health endpoint works
- [ ] Test frontend can call backend (check browser console)

---

## 🚀 Quick Fix Script

If you're still having issues, test each service individually:

```bash
# 1. Test Vanna
curl https://your-vanna-url.onrender.com/health

# 2. Test Backend
curl https://your-backend-url.onrender.com/health

# 3. Test Backend → Vanna connection
curl -X POST https://your-backend-url.onrender.com/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'

# 4. Check if frontend can reach backend (from browser console)
# Open your frontend, press F12, go to Network tab
# Try the chat feature and see what error appears
```

---

## 📝 Most Common Missing Variable

**90% of "failed to fetch" errors are caused by:**

1. **`NEXT_PUBLIC_API_BASE` not set in Vercel** → Frontend tries to call `localhost:3001`
2. **`VANNA_API_BASE_URL` not set in backend** → Backend can't reach Vanna
3. **`FRONTEND_URL` wrong in backend** → CORS blocks the request

Check these three first!

---

Need help? Check the browser console (F12) and Render logs for specific error messages.


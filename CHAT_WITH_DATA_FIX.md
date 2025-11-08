# 🔧 Fix Chat with Data Connection Error

## Error: "Cannot connect to API"

Your frontend is trying to connect to: `https://flowbit-backend-2.onrender.com`

---

## Step 1: Verify Backend Service is Running

### Check Backend Status

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Find your backend service: `flowbit-backend-2` (or your service name)
3. Check if status is **"Live"** (green)
4. If it says "Build failed" or "Stopped", fix that first

### Test Backend Directly

Open in browser or use curl:
```
https://flowbit-backend-2.onrender.com/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

**If this fails:**
- Backend is not deployed or not running
- Check Render logs for errors
- Redeploy the backend service

---

## Step 2: Check CORS Configuration

The error might be CORS blocking the request.

### Verify Backend Environment Variables

1. Go to Render → Backend Service → **Environment** tab
2. Check `FRONTEND_URL` is set to:
   ```
   https://flowbit-ai-web.vercel.app
   ```
3. **Important:** 
   - No trailing slash
   - Must match your frontend URL exactly
   - Case-sensitive

### Test CORS

Open browser console (F12) and look for:
- `Access-Control-Allow-Origin` errors
- CORS policy errors

**If CORS error:**
- Update `FRONTEND_URL` in backend
- Restart backend service
- Clear browser cache and try again

---

## Step 3: Verify Backend Can Reach Vanna

The Chat with Data feature requires:
1. Frontend → Backend ✅ (this is failing)
2. Backend → Vanna (check this too)

### Check Backend Environment Variables

In Render → Backend Service → Environment:

1. **VANNA_API_BASE_URL** must be set
   - Value: `https://your-vanna-url.onrender.com`
   - Example: `https://flowbit-vanna.onrender.com`
   - No trailing slash!

### Test Vanna Service

```bash
curl https://your-vanna-url.onrender.com/health
```

Should return:
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

## Step 4: Check Backend Logs

1. Go to Render → Backend Service → **Logs** tab
2. Look for errors when you try Chat with Data:
   - "CORS blocked origin" → Fix `FRONTEND_URL`
   - "Vanna API error" → Fix `VANNA_API_BASE_URL`
   - "Database connection error" → Fix `DATABASE_URL`
   - "Cannot connect" → Service not running

---

## Step 5: Verify Frontend Configuration

### Check Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Verify `NEXT_PUBLIC_API_BASE` is set to:
   ```
   https://flowbit-backend-2.onrender.com
   ```
5. **Important:**
   - No trailing slash
   - Must match your backend URL exactly
   - Available for: Production, Preview, Development

### Redeploy Frontend

After updating environment variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Or push a new commit to trigger redeploy

---

## Step 6: Complete Checklist

### Backend Service (Render)
- [ ] Service is "Live" (not stopped/failed)
- [ ] `FRONTEND_URL` = `https://flowbit-ai-web.vercel.app` (exact match)
- [ ] `VANNA_API_BASE_URL` = Your Vanna service URL
- [ ] `DATABASE_URL` = Neon connection string
- [ ] `NODE_ENV` = `production`
- [ ] Health endpoint works: `/health`

### Vanna Service (Render)
- [ ] Service is "Live"
- [ ] `DATABASE_URL` = Neon connection string (same as backend)
- [ ] `GROQ_API_KEY` = Your Groq API key
- [ ] Health endpoint works: `/health`

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_BASE` = `https://flowbit-backend-2.onrender.com`
- [ ] Frontend redeployed after setting env var
- [ ] No build errors

---

## Step 7: Test the Full Flow

### Test 1: Backend Health
```bash
curl https://flowbit-backend-2.onrender.com/health
```
Should return: `{"status":"ok"}`

### Test 2: Backend Root
```bash
curl https://flowbit-backend-2.onrender.com/
```
Should return API information

### Test 3: Chat Endpoint (from command line)
```bash
curl -X POST https://flowbit-backend-2.onrender.com/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query":"How many invoices are there?"}'
```

**If this works but frontend doesn't:**
- It's a CORS issue → Fix `FRONTEND_URL` in backend
- Or frontend env var not set → Fix `NEXT_PUBLIC_API_BASE` in Vercel

**If this fails:**
- Check backend logs
- Check if Vanna service is running
- Check if `VANNA_API_BASE_URL` is set correctly

### Test 4: Frontend
1. Open: `https://flowbit-ai-web.vercel.app/`
2. Go to Chat page
3. Open browser console (F12)
4. Try a query
5. Check Network tab for the API call
6. Look at the error message

---

## Common Issues & Quick Fixes

### Issue 1: Backend Not Running
**Symptom:** Cannot reach backend URL

**Fix:**
1. Check Render dashboard - is service "Live"?
2. Check logs for errors
3. Redeploy if needed

### Issue 2: CORS Error
**Symptom:** "Access-Control-Allow-Origin" in console

**Fix:**
1. Backend `FRONTEND_URL` must match frontend URL exactly
2. No trailing slashes
3. Restart backend after updating

### Issue 3: Frontend Can't Find Backend
**Symptom:** "Cannot connect to API" error

**Fix:**
1. Set `NEXT_PUBLIC_API_BASE` in Vercel
2. Redeploy frontend
3. Clear browser cache

### Issue 4: Backend Can't Reach Vanna
**Symptom:** Chat returns "Failed to process query"

**Fix:**
1. Set `VANNA_API_BASE_URL` in backend
2. Verify Vanna service is running
3. Test Vanna health endpoint

---

## Quick Fix Summary

**Most likely causes (in order):**

1. **Backend not running** → Check Render dashboard
2. **CORS blocking** → Fix `FRONTEND_URL` in backend
3. **Frontend env var missing** → Set `NEXT_PUBLIC_API_BASE` in Vercel
4. **Vanna not configured** → Set `VANNA_API_BASE_URL` in backend

---

## Still Not Working?

1. **Check browser console** (F12) for specific error
2. **Check Render backend logs** for errors
3. **Test backend directly** with curl
4. **Verify all environment variables** are set correctly
5. **Restart all services** after making changes

Share the specific error message from browser console or Render logs for more targeted help!


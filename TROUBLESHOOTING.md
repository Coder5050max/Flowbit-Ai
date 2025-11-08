# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Backend "Cannot GET /" Error

**Status:** ✅ FIXED - Added root route

The backend now has a root route that returns API information. If you still see this error:
1. Make sure you've pulled the latest changes
2. Redeploy the backend service
3. Try accessing: `https://your-backend-url.onrender.com/health` instead

---

### Issue 2: Vanna Service 502 Bad Gateway

**Common Causes:**

#### A. Missing Environment Variables

The Vanna service requires these environment variables in Render:

1. **DATABASE_URL** - Your PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database`
   - Or: `postgresql+psycopg://user:password@host:port/database`

2. **GROQ_API_KEY** - Your Groq API key
   - Get one at: https://console.groq.com/

3. **PORT** - Usually set automatically by Render (default: 10000)

**How to Fix:**
1. Go to your Vanna service in Render Dashboard
2. Click on "Environment" tab
3. Add/verify these variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/db
   GROQ_API_KEY=your-groq-api-key-here
   ```
4. Click "Save Changes"
5. The service will automatically redeploy

---

#### B. Service Not Starting

**Check Render Logs:**
1. Go to your Vanna service in Render
2. Click on "Logs" tab
3. Look for error messages

**Common errors:**
- `DATABASE_URL environment variable is not set` → Add DATABASE_URL
- `GROQ_API_KEY environment variable is not set` → Add GROQ_API_KEY
- `Module not found` → Check requirements.txt is correct
- `Port already in use` → Render handles this automatically

---

#### C. Wrong Start Command

**For Render Python service, the start command should be:**

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Or if using a different structure:
```bash
cd services/vanna && uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Check in Render:**
1. Go to your Vanna service
2. Click "Settings"
3. Verify "Start Command" is correct
4. Root Directory should be: `services/vanna` (if deploying from monorepo root)

---

#### D. Database Connection Issues

**Test database connection:**
1. Check DATABASE_URL format is correct
2. Verify database is accessible from Render
3. Test connection string locally first

**Common DATABASE_URL formats:**
- Render PostgreSQL: `postgresql://user:pass@host:port/dbname?sslmode=require`
- Supabase: `postgresql://user:pass@host:port/dbname`
- Neon: `postgresql://user:pass@host:port/dbname?sslmode=require`

---

### Issue 3: Service Health Checks

**Test Vanna Service:**
```bash
# Root endpoint
curl https://your-vanna-url.onrender.com/

# Health check
curl https://your-vanna-url.onrender.com/health
```

**Expected Response:**
```json
{
  "service": "vanna-ai",
  "status": "ok",
  "database_configured": true,
  "groq_configured": true
}
```

If `database_configured` or `groq_configured` is `false`, add the missing environment variables.

---

### Issue 4: Backend Cannot Connect to Vanna

**Symptoms:**
- Chat with Data feature doesn't work
- Backend returns errors when calling Vanna

**Check:**
1. Verify `VANNA_API_BASE_URL` in backend environment variables
2. Make sure it matches your Vanna service URL exactly
3. Test Vanna service directly first (see above)
4. Check CORS settings (should allow all origins for now)

---

## Step-by-Step Fix for 502 Error

### Step 1: Check Render Logs
1. Go to Render Dashboard
2. Select your Vanna service
3. Click "Logs" tab
4. Look for error messages
5. Copy any error messages

### Step 2: Verify Environment Variables
1. Click "Environment" tab
2. Verify these are set:
   - `DATABASE_URL`
   - `GROQ_API_KEY`
   - `PORT` (usually auto-set by Render)

### Step 3: Check Service Settings
1. Click "Settings" tab
2. Verify:
   - **Root Directory:** `services/vanna` (if deploying from monorepo)
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Build Command:** (usually not needed for Python, but can be `pip install -r requirements.txt`)

### Step 4: Manual Deploy
1. Click "Manual Deploy" → "Deploy latest commit"
2. Watch the logs for errors
3. Wait for deployment to complete

### Step 5: Test Service
```bash
curl https://your-vanna-url.onrender.com/health
```

---

## Quick Diagnostic Commands

### Test Backend
```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Root endpoint
curl https://your-backend-url.onrender.com/
```

### Test Vanna
```bash
# Health check
curl https://your-vanna-url.onrender.com/health

# Root endpoint  
curl https://your-vanna-url.onrender.com/
```

### Test Database Connection (from Render Shell)
1. Go to your Vanna service
2. Click "Shell"
3. Run:
```bash
python -c "import psycopg2; conn = psycopg2.connect('$DATABASE_URL'); print('Connected!')"
```

---

## Environment Variables Checklist

### Backend Service (Render)
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL=postgresql://...`
- [ ] `VANNA_API_BASE_URL=https://your-vanna-url.onrender.com`
- [ ] `FRONTEND_URL=https://your-frontend-url.vercel.app`
- [ ] `PORT` (auto-set by Render)

### Vanna Service (Render)
- [ ] `DATABASE_URL=postgresql://...` (same as backend)
- [ ] `GROQ_API_KEY=your-groq-api-key`
- [ ] `PORT` (auto-set by Render)

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_BASE=https://your-backend-url.onrender.com`
- [ ] `NEXT_PUBLIC_APP_URL=https://your-frontend-url.vercel.app`

---

## Still Having Issues?

1. **Check all logs** in Render Dashboard
2. **Verify all environment variables** are set correctly
3. **Test each service individually** before testing integration
4. **Check service status** - make sure all services show "Live" in Render
5. **Wait a few minutes** after setting environment variables for service to restart

---

## Common Error Messages

| Error | Solution |
|-------|----------|
| `502 Bad Gateway` | Service not starting - check logs and env vars |
| `Cannot GET /` | Missing root route (now fixed) |
| `DATABASE_URL not set` | Add DATABASE_URL to environment variables |
| `GROQ_API_KEY not set` | Add GROQ_API_KEY to environment variables |
| `Connection refused` | Service not running - check logs |
| `CORS error` | Check FRONTEND_URL matches frontend domain |

---

Need more help? Check the Render documentation or service logs for specific error messages.


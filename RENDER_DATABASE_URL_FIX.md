# 🔧 Fix: Prisma DATABASE_URL Error in Render

## Error Message
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`.
```

## Cause
The `DATABASE_URL` environment variable is either:
1. **Not set** in Render
2. **Empty** or **invalid format**
3. **Not available during build phase**

---

## ✅ Solution: Set DATABASE_URL in Render

### Step 1: Get Your Neon Database URL

Your Neon connection string should look like:
```
postgresql://neondb_owner:npg_N4r8GbefOCjH@ep-square-king-aduqn74a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Important:** Make sure it starts with `postgresql://` or `postgres://`

---

### Step 2: Set DATABASE_URL in Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your **Backend Service** (e.g., `flowbit-api` or `flowbit-backend-2`)
3. Click **"Environment"** tab (in the top menu)
4. Look for `DATABASE_URL` in the environment variables list
5. **If it exists:**
   - Click on it
   - Make sure the value is your **full Neon connection string**
   - Make sure it starts with `postgresql://`
   - Click **"Save Changes"**
6. **If it doesn't exist:**
   - Click **"Add Environment Variable"** or **"Add"** button
   - Key: `DATABASE_URL`
   - Value: Paste your **full Neon connection string**
   - Click **"Save Changes"**

---

### Step 3: Verify the Format

Your `DATABASE_URL` should be:
```
postgresql://username:password@host:port/database?sslmode=require
```

**Example:**
```
postgresql://neondb_owner:npg_N4r8GbefOCjH@ep-square-king-aduqn74a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Common Issues:**
- ❌ Missing `postgresql://` prefix
- ❌ Has extra spaces or quotes
- ❌ Missing password or username
- ❌ Wrong host/port

---

### Step 4: Redeploy

After setting `DATABASE_URL`:

1. Go to your Backend Service in Render
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
   OR
   - Push a new commit to trigger auto-deploy
3. Wait for the build to complete
4. Check the logs to verify it's working

---

## 🔍 Verify DATABASE_URL is Set

### Check Render Logs

1. Go to Backend Service → **"Logs"** tab
2. Look for any DATABASE_URL related errors
3. The build should now succeed

### Test After Deployment

Once deployed, test the health endpoint:
```bash
curl https://your-backend-url.onrender.com/health
```

Should return: `{"status":"ok"}`

---

## 🚨 If Still Not Working

### Option 1: Check for Typos

1. Copy your Neon connection string exactly
2. Paste it into Render's `DATABASE_URL`
3. Make sure there are no extra spaces before/after
4. Make sure it's not wrapped in quotes (Render handles this)

### Option 2: Use Neon Connection Pooler URL

If you're using Neon, make sure you're using the **pooler** URL (ends with `-pooler`), not the direct connection URL.

**Pooler URL format:**
```
postgresql://user:pass@ep-xxx-xxx-pooler.region.aws.neon.tech/db?sslmode=require
```

### Option 3: Check Render Environment Variables

1. Go to Backend Service → **Environment** tab
2. Verify `DATABASE_URL` is listed
3. Make sure it's not marked as "Secret" incorrectly
4. Try removing and re-adding it

---

## 📋 Quick Checklist

- [ ] `DATABASE_URL` is set in Render → Backend Service → Environment
- [ ] URL starts with `postgresql://` or `postgres://`
- [ ] URL includes username, password, host, port, and database name
- [ ] URL includes `?sslmode=require` for Neon
- [ ] No extra spaces or quotes around the URL
- [ ] Backend service has been redeployed after setting the variable

---

## 💡 Why This Happens

Prisma needs to validate the database connection string format during `prisma generate` (which runs during build). Even though it doesn't actually connect during generation, it still validates that the URL format is correct.

If `DATABASE_URL` is missing or invalid, Prisma throws this error during the build phase.

---

## ✅ After Fix

Once `DATABASE_URL` is correctly set:
1. ✅ Build will succeed
2. ✅ Migrations can run (if added to build command)
3. ✅ Backend can connect to database
4. ✅ API endpoints will work

---

**Need Help?** Check Render logs for the exact error message and share it for more specific troubleshooting.


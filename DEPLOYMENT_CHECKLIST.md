# ✅ Deployment Checklist - Vercel + Render

Use this checklist to ensure error-free deployment.

## 🔍 Pre-Deployment Checks

### Code Quality
- [ ] No TypeScript errors (`npm run build` works locally)
- [ ] No linting errors
- [ ] All environment variables are documented
- [ ] `.gitignore` is correct (no secrets committed)

### Files Created
- [ ] `vercel.json` exists in root
- [ ] `render.yaml` exists in root
- [ ] `.env.example` files exist (for reference)

---

## 🎨 Frontend Deployment (Vercel)

### Configuration
- [ ] Repository connected to Vercel
- [ ] **Root Directory**: `apps/web` (CRITICAL!)
- [ ] **Framework Preset**: Next.js (auto-detected)
- [ ] **Build Command**: `npm install && npm run build` (runs in apps/web)
- [ ] **Output Directory**: `.next` (default)

### Environment Variables (Vercel Dashboard)
- [ ] `NEXT_PUBLIC_API_BASE` = `https://your-backend.onrender.com`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://your-frontend.vercel.app`

**Important**: 
- Use `https://` (not `http://`)
- No trailing slash
- Replace with your actual URLs after deployment

### Build & Deploy
- [ ] Build completes successfully
- [ ] No build errors
- [ ] Frontend URL is accessible
- [ ] Dashboard loads (may show errors until backend is connected)

---

## ⚙️ Backend Deployment (Render)

### Configuration
- [ ] Repository connected to Render
- [ ] **Root Directory**: `apps/api` (CRITICAL!)
- [ ] **Environment**: Node
- [ ] **Build Command**: `npm install && npx prisma generate && npm run build`
- [ ] **Start Command**: `npm start`
- [ ] **Port**: Uses `PORT` env var (Render provides this)

### Environment Variables (Render Dashboard)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000` (or leave empty, Render will set it)
- [ ] `DATABASE_URL` = Your production PostgreSQL URL
- [ ] `VANNA_API_BASE_URL` = Your Vanna AI service URL
- [ ] `FRONTEND_URL` = Your Vercel frontend URL

**Important**:
- `DATABASE_URL` format: `postgresql://user:pass@host:5432/dbname`
- `VANNA_API_BASE_URL` format: `https://your-vanna.onrender.com`
- `FRONTEND_URL` format: `https://your-frontend.vercel.app`

### Build & Deploy
- [ ] Build completes successfully
- [ ] Prisma client generates without errors
- [ ] TypeScript compiles without errors
- [ ] Backend URL is accessible
- [ ] `/health` endpoint returns: `{"status":"ok"}`

### Database Setup (After Backend Deploy)
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed database: `npx prisma db seed`
- [ ] Verify data is loaded

---

## 🔗 Post-Deployment Configuration

### Update URLs After Both Deploy

1. **Get your URLs:**
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-api.onrender.com`

2. **Update Frontend (Vercel):**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_BASE` = `https://your-api.onrender.com`
   - Redeploy (or wait for auto-redeploy)

3. **Update Backend (Render):**
   - Go to Render Dashboard → Environment
   - Update `FRONTEND_URL` = `https://your-app.vercel.app`
   - Service will auto-redeploy

---

## ✅ Testing Checklist

### Frontend Tests
- [ ] Visit frontend URL - dashboard loads
- [ ] Check browser console - no CORS errors
- [ ] Check browser console - no network errors
- [ ] Metric cards display data
- [ ] Charts render with data
- [ ] Tables are searchable/sortable

### Backend Tests
- [ ] `https://your-api.onrender.com/health` works
- [ ] `https://your-api.onrender.com/api/stats` returns data
- [ ] `https://your-api.onrender.com/api/invoice-trends` returns data
- [ ] All API endpoints respond correctly

### Integration Tests
- [ ] Frontend can fetch data from backend
- [ ] Chat with Data feature works
- [ ] No CORS errors in browser console
- [ ] All charts display real data

---

## 🐛 Common Errors & Fixes

### Error 1: "Cannot find module '@prisma/client'"
**Fix**: Add `postinstall` script in `apps/api/package.json`:
```json
"postinstall": "prisma generate"
```

### Error 2: CORS Error
**Fix**: 
- Check `FRONTEND_URL` in Render matches your Vercel URL
- Check CORS configuration in `apps/api/src/server.ts`
- Ensure URLs use `https://` not `http://`

### Error 3: "Failed to fetch" in Frontend
**Fix**:
- Check `NEXT_PUBLIC_API_BASE` in Vercel matches your Render backend URL
- Verify backend is running and accessible
- Check browser console for specific error

### Error 4: Database Connection Error
**Fix**:
- Verify `DATABASE_URL` is correct in Render
- Check database firewall allows Render IPs
- For Supabase/Neon: Use connection pooling URL if available

### Error 5: Build Fails on Render
**Fix**:
- Check build command includes: `npx prisma generate`
- Verify `apps/api` is the root directory
- Check Render logs for specific error

---

## 📝 Final Verification

Before submitting:

- [ ] Frontend is live on Vercel
- [ ] Backend is live on Render
- [ ] All environment variables are set correctly
- [ ] Database is seeded with data
- [ ] All features work end-to-end
- [ ] No console errors
- [ ] No CORS errors
- [ ] Chat with Data feature works

---

## 🎉 Deployment Complete!

Your application should now be live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`

Update `SUBMISSION.md` with your actual URLs!


# ✅ Quick Submission Checklist

Use this checklist to ensure you've completed everything before submitting.

## 📦 Step 1: GitHub Repository

- [ ] Create GitHub repository
- [ ] Push all code to main branch
- [ ] Verify repository structure matches requirements:
  - [ ] `/apps/web` exists
  - [ ] `/apps/api` exists
  - [ ] `/services/vanna` exists
  - [ ] `/data/Analytics_Test_Data.json` exists
- [ ] Make repository public OR share invite link
- [ ] Test repository is accessible

**Repository URL**: `https://github.com/YOUR_USERNAME/flowbit-ai-analytics`

---

## 🚀 Step 2: Deploy Frontend & Backend (Vercel)

- [ ] Sign up/login to Vercel
- [ ] Import GitHub repository
- [ ] Deploy frontend (apps/web)
- [ ] Deploy backend (apps/api)
- [ ] Configure environment variables in Vercel
- [ ] Test frontend URL works
- [ ] Test backend API URL works
- [ ] Verify CORS is configured

**Frontend URL**: `https://your-app.vercel.app`  
**Backend URL**: `https://your-api.vercel.app`

---

## 🤖 Step 3: Deploy Vanna AI (Self-Hosted)

Choose one platform:

### Option A: Render.com
- [ ] Sign up/login to Render
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory: `services/vanna`
- [ ] Configure build command: `pip install -r requirements.txt`
- [ ] Configure start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Add environment variables (DATABASE_URL, GROQ_API_KEY)
- [ ] Deploy service
- [ ] Test URL works

### Option B: Railway.app
- [ ] Sign up/login to Railway
- [ ] Create new project from GitHub
- [ ] Add service from `services/vanna` directory
- [ ] Configure build and start commands
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test URL works

**Vanna AI URL**: `https://your-vanna.onrender.com`

---

## 🗄️ Step 4: Set Up Production Database

Choose one provider:

- [ ] Create PostgreSQL database (Supabase/Neon/Railway)
- [ ] Get connection string
- [ ] Update DATABASE_URL in all services:
  - [ ] Backend API (Vercel)
  - [ ] Vanna AI (Render/Railway)
- [ ] Run migrations on production database
- [ ] Seed database with Analytics_Test_Data.json
- [ ] Verify data is loaded

**Database Provider**: [Supabase/Neon/Railway/etc.]

---

## 📝 Step 5: Update Environment Variables

### Backend API (Vercel)
- [ ] `DATABASE_URL` = production database URL
- [ ] `VANNA_API_BASE_URL` = Vanna AI URL
- [ ] `FRONTEND_URL` = frontend URL
- [ ] `PORT` = 3001

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_BASE` = backend API URL
- [ ] `NEXT_PUBLIC_APP_URL` = frontend URL

### Vanna AI (Render/Railway)
- [ ] `DATABASE_URL` = production database URL (postgresql+psycopg://...)
- [ ] `GROQ_API_KEY` = your Groq API key
- [ ] `PORT` = 10000 (or platform default)

---

## ✅ Step 6: Test Everything

- [ ] Visit frontend URL - dashboard loads
- [ ] Check metric cards show real data
- [ ] Check all charts display data
- [ ] Test table search/filter
- [ ] Test Chat with Data feature:
  - [ ] Query 1: "What's the total spend in the last 90 days?"
  - [ ] Query 2: "List top 5 vendors by spend"
  - [ ] Query 3: "Show overdue invoices as of today"
- [ ] Verify all API endpoints work
- [ ] Check browser console for errors
- [ ] Verify all services communicate correctly

---

## 📚 Step 7: Documentation

- [ ] README.md is complete
- [ ] SETUP.md has clear instructions
- [ ] API_DOCUMENTATION.md lists all endpoints
- [ ] DATABASE_SCHEMA.md includes ER diagram
- [ ] CHAT_WORKFLOW.md explains AI workflow
- [ ] SUBMISSION_GUIDE.md is complete
- [ ] SUBMISSION.md is filled in with your URLs

---

## 🎥 Step 8: Record Demo Video

- [ ] Prepare test queries
- [ ] Clear browser cache
- [ ] Start screen recording
- [ ] Record 3-5 minute video covering:
  - [ ] Dashboard loading
  - [ ] Charts and metrics
  - [ ] Table filters/search
  - [ ] Chat with Data workflow (3 queries)
- [ ] Upload to YouTube (unlisted) OR Google Drive
- [ ] Add video URL to SUBMISSION.md

**Video URL**: [YouTube/Drive link]

---

## 📋 Step 9: Fill Out SUBMISSION.md

- [ ] Add your name and contact info
- [ ] Add GitHub repository URL
- [ ] Add all deployment URLs:
  - [ ] Frontend URL
  - [ ] Backend URL
  - [ ] Vanna AI URL
  - [ ] Database provider
- [ ] Add demo video URL
- [ ] Check all acceptance criteria
- [ ] Verify all checkboxes are marked

---

## 🔍 Step 10: Final Review

- [ ] All URLs are live and working
- [ ] All documentation is complete
- [ ] Demo video is accessible
- [ ] Code is clean and well-documented
- [ ] No console errors
- [ ] All features work as expected
- [ ] Repository is accessible
- [ ] SUBMISSION.md is complete

---

## 📤 Step 11: Submit

- [ ] Push final changes to GitHub
- [ ] Double-check all URLs in SUBMISSION.md
- [ ] Share GitHub repository link
- [ ] Share deployment URLs
- [ ] Share demo video link
- [ ] Include SUBMISSION.md content

---

## 🎉 You're Ready!

If all checkboxes are marked, you're ready to submit! 🚀

**Good luck with your submission!**


# Complete Project Instructions

## 🎯 Project Overview

This is a **complete, production-ready** full-stack analytics platform built for Flowbit AI Internship Round 2. The project includes:

1. **Analytics Dashboard** - Interactive data visualization
2. **Chat with Data** - Natural language SQL queries using AI
3. **Backend API** - RESTful API with PostgreSQL
4. **Vanna AI Service** - Python FastAPI service for SQL generation

## 📦 What's Included

✅ Complete monorepo structure  
✅ PostgreSQL database with normalized schema  
✅ Backend API with all required endpoints  
✅ Frontend dashboard with charts and tables  
✅ AI-powered chat interface  
✅ Comprehensive documentation  
✅ Docker setup for database  
✅ Sample data for testing  

## 🚀 How to Run (Step by Step)

### Step 1: Prerequisites

Make sure you have installed:
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.10+ ([Download](https://www.python.org/))
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- Groq API Key ([Get one here](https://console.groq.com/))

### Step 2: Install Dependencies

Open terminal in the project root and run:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web
npm install
cd ../..

# Install backend dependencies
cd apps/api
npm install
cd ../..
```

### Step 3: Start PostgreSQL Database

```bash
# Start database (from project root)
docker-compose up -d

# Verify it's running
docker ps
```

You should see a `flowbit_postgres` container running.

### Step 4: Set Up Database Schema

```bash
cd apps/api

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed with sample data
npx prisma db seed

cd ../..
```

### Step 5: Configure Environment Variables

#### A. Backend API

Create file: `apps/api/.env.local`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowbit_analytics?schema=public"
VANNA_API_BASE_URL="http://localhost:8000"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

#### B. Frontend

Create file: `apps/web/.env.local`

```env
NEXT_PUBLIC_API_BASE="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### C. Vanna AI Service

Create file: `services/vanna/.env`

```env
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/flowbit_analytics"
GROQ_API_KEY="your-actual-groq-api-key-here"
PORT=8000
```

**⚠️ IMPORTANT:** Replace `your-actual-groq-api-key-here` with your real Groq API key from https://console.groq.com/

### Step 6: Start All Services

You need **3 separate terminal windows**:

#### Terminal 1: Vanna AI Service

```bash
cd services/vanna

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Start the service
uvicorn main:app --reload --port 8000
```

You should see: `Uvicorn running on http://0.0.0.0:8000`

#### Terminal 2: Backend API

```bash
# From project root
npm run dev --filter=api
```

Or manually:
```bash
cd apps/api
npm run dev
```

You should see: `🚀 API server running on http://localhost:3001`

#### Terminal 3: Frontend

```bash
# From project root
npm run dev --filter=web
```

Or manually:
```bash
cd apps/web
npm run dev
```

You should see: `Ready on http://localhost:3000`

### Step 7: Open the Application

Open your browser and go to: **http://localhost:3000**

You should see:
- ✅ Analytics Dashboard tab (default)
- ✅ Chat with Data tab
- ✅ Overview cards with metrics
- ✅ Interactive charts
- ✅ Invoices table

## 🧪 Testing the Features

### Test Dashboard

1. Check that all 4 overview cards show data
2. Verify charts are displaying
3. Try searching invoices
4. Filter by status

### Test Chat with Data

1. Click "Chat with Data" tab
2. Try these example queries:
   - "What's the total spend in the last 90 days?"
   - "List top 5 vendors by spend"
   - "Show overdue invoices as of today"
3. Verify:
   - SQL is generated
   - Results are displayed
   - No errors occur

## 📁 Project Structure Explained

```
flowbit-ai-analytics/
├── apps/
│   ├── web/              # Next.js frontend application
│   └── api/              # Express.js backend API
├── services/
│   └── vanna/            # Python FastAPI AI service
├── data/
│   └── Analytics_Test_Data.json  # Sample data
├── docker-compose.yml    # PostgreSQL database
└── Documentation files
```

## 🔍 Troubleshooting

### Database Issues

**Problem:** Can't connect to database

**Solution:**
```bash
# Check if container is running
docker ps

# Restart container
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Backend API Issues

**Problem:** API not responding

**Solution:**
1. Check `apps/api/.env.local` exists and has correct values
2. Verify database is running
3. Check terminal for error messages
4. Try: `cd apps/api && npm run dev`

### Frontend Issues

**Problem:** Frontend not loading or API errors

**Solution:**
1. Check `apps/web/.env.local` exists
2. Verify backend API is running on port 3001
3. Check browser console for errors
4. Clear browser cache

### Vanna AI Issues

**Problem:** Chat feature not working

**Solution:**
1. Verify Groq API key is correct in `services/vanna/.env`
2. Check Vanna service is running on port 8000
3. Test: `curl http://localhost:8000/health`
4. Check Python virtual environment is activated
5. Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`

### Port Already in Use

**Problem:** Port 3000, 3001, or 8000 already in use

**Solution:**
- Change PORT in respective `.env` files
- Update related URLs in other `.env` files
- Kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3000 | xargs kill
  ```

## 📚 Documentation Files

- **README.md** - Main project overview
- **QUICK_START.md** - Fast setup guide
- **SETUP.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - API endpoint reference
- **CHAT_WORKFLOW.md** - How chat feature works
- **DATABASE_SCHEMA.md** - Database structure
- **PROJECT_SUMMARY.md** - Project overview

## 🚢 Deployment Instructions

### Frontend & Backend (Vercel)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure:
   - Root directory: `apps/web` (for frontend)
   - Build command: `npm run build`
   - Environment variables: Add all from `.env.local`
5. Deploy

For backend API:
- Create separate Vercel project
- Root directory: `apps/api`
- Build command: `npm run build`
- Start command: `npm start`

### Vanna AI (Render/Railway)

1. Go to [Render](https://render.com) or [Railway](https://railway.app)
2. Create new Python service
3. Connect GitHub repository
4. Configure:
   - Root directory: `services/vanna`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy

### Database (Production)

Use a managed PostgreSQL service:
- **Supabase** (free tier): https://supabase.com
- **Neon** (serverless): https://neon.tech
- **Railway**: Includes PostgreSQL
- **DigitalOcean**: Managed databases

Update `DATABASE_URL` in all services to point to production database.

## ✅ Checklist Before Submission

- [ ] All services start without errors
- [ ] Database is seeded with data
- [ ] Dashboard displays all charts and metrics
- [ ] Invoices table is searchable and filterable
- [ ] Chat with Data generates SQL and returns results
- [ ] All environment variables are set
- [ ] Documentation is complete
- [ ] Code is clean and well-structured

## 🎓 Key Features Demonstrated

1. **Monorepo Architecture** - Turborepo for managing multiple apps
2. **Database Design** - Normalized PostgreSQL schema with Prisma
3. **RESTful API** - Complete backend with all required endpoints
4. **Modern Frontend** - Next.js 14 with TypeScript and shadcn/ui
5. **Data Visualization** - Interactive charts with Recharts
6. **AI Integration** - Natural language to SQL using Groq
7. **Production Ready** - Error handling, CORS, type safety

## 💡 Tips

- Use Prisma Studio to view data: `cd apps/api && npx prisma studio`
- Check API health: `http://localhost:3001/health`
- Check Vanna health: `http://localhost:8000/health`
- Use browser DevTools to debug frontend
- Check terminal logs for backend errors

## 🆘 Need Help?

1. Read the documentation files
2. Check error messages in terminal
3. Verify all environment variables
4. Ensure all services are running
5. Check database connection

## 🎉 Success!

If everything is working:
- ✅ Dashboard shows real data
- ✅ Charts are interactive
- ✅ Chat generates SQL and returns results
- ✅ All features are functional

**Congratulations! Your project is ready for submission!** 🚀

---

**Good luck with your internship!** 💪


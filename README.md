# Flowbit AI Analytics Platform

A production-grade full-stack web application featuring an Interactive Analytics Dashboard and "Chat with Data" interface powered by Vanna AI and Groq.

## 🏗️ Architecture

This is a monorepo built with Turborepo containing:

- **apps/web** - Next.js frontend with shadcn/ui and TailwindCSS
- **apps/api** - Express.js backend API with PostgreSQL and Prisma
- **services/vanna** - Python FastAPI service for natural language SQL generation

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL 14+ (or Docker)
- Groq API key ([Get one here](https://console.groq.com/))

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web && npm install && cd ../..

# Install backend dependencies
cd apps/api && npm install && cd ../..
```

### 2. Set Up Database

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

### 3. Configure Environment Variables

Create `.env.local` files in each app:

**apps/api/.env.local:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowbit_analytics?schema=public"
VANNA_API_BASE_URL="http://localhost:8000"
PORT=3001
```

**apps/web/.env.local:**
```env
NEXT_PUBLIC_API_BASE="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**services/vanna/.env:**
```env
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/flowbit_analytics"
GROQ_API_KEY="your-groq-api-key-here"
PORT=8000
```

### 4. Start Services

**Terminal 1 - Vanna AI Service:**
```bash
cd services/vanna
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Backend API:**
```bash
npm run dev --filter=api
```

**Terminal 3 - Frontend:**
```bash
npm run dev --filter=web
```

Visit http://localhost:3000 to see the dashboard!

## 📁 Project Structure

```
.
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── api/              # Express backend
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   └── services/
│       └── prisma/
├── services/
│   └── vanna/            # Python FastAPI service
│       ├── main.py
│       └── requirements.txt
├── data/
│   └── Analytics_Test_Data.json
├── docker-compose.yml
└── package.json
```

## 🗄️ Database Schema

The database is normalized into the following tables:

- **vendors** - Vendor information
- **customers** - Customer information
- **invoices** - Invoice headers
- **line_items** - Invoice line items
- **payments** - Payment records
- **categories** - Expense categories

See `apps/api/prisma/schema.prisma` for the complete schema.

## 🔌 API Endpoints

### Dashboard Endpoints

- `GET /api/stats` - Overview statistics
- `GET /api/invoice-trends` - Monthly invoice trends
- `GET /api/vendors/top10` - Top 10 vendors by spend
- `GET /api/category-spend` - Spend by category
- `GET /api/cash-outflow` - Cash outflow forecast
- `GET /api/invoices` - List invoices with filters

### AI Endpoints

- `POST /api/chat-with-data` - Natural language query to SQL

## 🤖 Chat with Data Workflow

1. User enters natural language question in frontend
2. Frontend sends POST to `/api/chat-with-data`
3. Backend proxies request to Vanna AI service
4. Vanna AI uses Groq to generate SQL query
5. SQL is executed on PostgreSQL database
6. Results are returned as JSON
7. Frontend displays SQL and results table/chart

## 🚢 Deployment

### Frontend & Backend (Vercel)

1. Connect your GitHub repo to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy both apps/web and apps/api

### Vanna AI (Render/Railway)

1. Create a new Python service
2. Set environment variables
3. Deploy from `services/vanna` directory

### Database

Use a managed PostgreSQL service (Supabase, Neon, Railway, etc.) and update `DATABASE_URL` in all services.

## 📊 Features

- ✅ Pixel-accurate analytics dashboard
- ✅ Real-time data visualization
- ✅ Natural language query interface
- ✅ SQL generation with Vanna AI
- ✅ Responsive design
- ✅ Production-ready architecture

## 📝 License

MIT


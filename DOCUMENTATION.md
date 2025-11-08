# 📚 Flowbit AI - Complete Documentation

## Table of Contents

1. [Setup Guide](#setup-guide)
2. [Database Schema](#database-schema)
3. [API Documentation](#api-documentation)
4. [Chat with Data Workflow](#chat-with-data-workflow)

---

## Setup Guide

See [SETUP.md](./SETUP.md) for complete setup instructions.

### Quick Start

```bash
# 1. Install dependencies
npm install
cd apps/web && npm install && cd ../..
cd apps/api && npm install && cd ../..

# 2. Start database
docker-compose up -d

# 3. Set up environment variables (see SETUP.md)

# 4. Run migrations
cd apps/api
npx prisma generate
npx prisma migrate dev

# 5. Seed database
npx prisma db seed

# 6. Start services
# Terminal 1: Vanna AI
cd services/vanna
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2: Backend
npm run dev --filter=api

# Terminal 3: Frontend
npm run dev --filter=web
```

### Environment Variables

**Backend (`apps/api/.env.local`):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowbit_analytics"
VANNA_API_BASE_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"
PORT=3001
NODE_ENV=development
```

**Frontend (`apps/web/.env.local`):**
```env
NEXT_PUBLIC_API_BASE="http://localhost:3001"
```

**Vanna (`services/vanna/.env`):**
```env
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/flowbit_analytics"
GROQ_API_KEY="your-groq-api-key"
PORT=8000
```

---

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete schema documentation.

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Vendors   │◄────────┤   Invoices   ├────────►│  Customers  │
│             │         │              │         │             │
│ - id        │         │ - id         │         │ - id        │
│ - name      │         │ - invoice_#  │         │ - name      │
│ - email     │         │ - vendor_id  │         │ - email     │
│ - phone     │         │ - customer_id│         │ - phone     │
│ - address   │         │ - issue_date │         │ - address   │
│ - tax_id    │         │ - due_date   │         │ - tax_id    │
└─────────────┘         │ - status     │         └─────────────┘
                        │ - subtotal   │
                        │ - tax        │
                        │ - total      │
                        └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            ┌───────────────┐    ┌───────────────┐
            │  Line Items   │    │   Payments    │
            │               │    │               │
            │ - id          │    │ - id          │
            │ - invoice_id  │    │ - invoice_id  │
            │ - description │    │ - amount      │
            │ - category    │    │ - payment_date│
            │ - quantity    │    │ - method      │
            │ - unit_price  │    │ - reference   │
            │ - amount      │    └───────────────┘
            └───────────────┘
```

### Tables

- **vendors** - Vendor/supplier information
- **customers** - Customer/client information
- **invoices** - Invoice headers
- **line_items** - Invoice line items (products/services)
- **payments** - Payment records

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed table structures.

---

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Base URL
- **Development**: `http://localhost:3001`
- **Production**: Your deployed API URL

### Endpoints

#### Dashboard Endpoints
- `GET /health` - Health check
- `GET /api/stats` - Overview statistics
- `GET /api/invoice-trends` - Monthly invoice trends
- `GET /api/vendors/top10` - Top 10 vendors by spend
- `GET /api/category-spend` - Spend by category
- `GET /api/cash-outflow` - Cash outflow forecast
- `GET /api/invoices` - List invoices (paginated, filterable)

#### AI Endpoints
- `POST /api/chat-with-data` - Natural language to SQL query

### Example Requests

**Get Stats:**
```bash
curl http://localhost:3001/api/stats
```

**Chat with Data:**
```bash
curl -X POST http://localhost:3001/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the total spend this month?"}'
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed request/response examples.

---

## Chat with Data Workflow

See [CHAT_WORKFLOW.md](./CHAT_WORKFLOW.md) for complete workflow documentation.

### Overview

The Chat with Data feature converts natural language questions into SQL queries and returns results.

### Flow Diagram

```
┌─────────────┐
│   Frontend  │
│  (Next.js)  │
└──────┬──────┘
       │ POST /api/chat-with-data
       │ { "query": "..." }
       ▼
┌─────────────┐
│   Backend   │
│  (Express)  │
└──────┬──────┘
       │ POST /query
       │ { "query": "..." }
       ▼
┌─────────────┐
│ Vanna AI    │
│ (FastAPI)   │
└──────┬──────┘
       │
       ├─► Groq LLM (SQL Generation)
       │
       └─► PostgreSQL (Query Execution)
              │
              ▼
         ┌─────────┐
         │ Results │
         └─────────┘
              │
              ▼
         Back to Frontend
```

### Step-by-Step

1. **User Input**: User types question in frontend
2. **Frontend → Backend**: POST to `/api/chat-with-data`
3. **Backend → Vanna**: Proxies request to Vanna service
4. **Vanna → Groq**: Uses LLM to generate SQL
5. **Vanna → Database**: Executes SQL query
6. **Response**: Returns SQL + results to frontend
7. **Display**: Frontend shows SQL and results table

### Example

**User Query:** "What's the total spend in the last 90 days?"

**Generated SQL:**
```sql
SELECT SUM(total) as total_spend 
FROM invoices 
WHERE issue_date >= CURRENT_DATE - INTERVAL '90 days';
```

**Response:**
```json
{
  "sql": "SELECT SUM(total)...",
  "data": [{ "total_spend": "123456.78" }],
  "error": null
}
```

See [CHAT_WORKFLOW.md](./CHAT_WORKFLOW.md) for detailed explanation.

---

## Project Structure

```
.
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── app/          # Pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   └── api/              # Express backend
│       ├── src/
│       │   ├── routes/   # API routes
│       │   └── lib/      # Prisma client
│       └── prisma/       # Database schema & migrations
├── services/
│   └── vanna/            # Python FastAPI service
│       ├── main.py
│       └── requirements.txt
├── data/
│   └── Analytics_Test_Data.json
├── docker-compose.yml
├── render.yaml
└── package.json
```

---

## Deployment

### Frontend (Vercel)
- Connect GitHub repository
- Set `NEXT_PUBLIC_API_BASE` environment variable
- Deploy

### Backend (Render)
- Create Web Service
- Root Directory: `apps/api`
- Build: `npm install && npm run build`
- Start: `npm start`
- Set environment variables

### Vanna (Render)
- Create Web Service (Python)
- Root Directory: `services/vanna`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set environment variables

---

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **AI Service**: Python FastAPI, Groq LLM
- **Deployment**: Vercel (frontend), Render (backend & Vanna)

---

## License

Private project


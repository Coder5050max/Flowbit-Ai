# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be 18+
python --version  # Should be 3.10+
docker --version  # Should be installed
```

## Step 1: Install Dependencies

```bash
# Root dependencies
npm install

# Frontend
cd apps/web && npm install && cd ../..

# Backend
cd apps/api && npm install && cd ../..
```

## Step 2: Start Database

```bash
docker-compose up -d
```

## Step 3: Set Up Database

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ../..
```

## Step 4: Configure Environment

### Backend (`apps/api/.env.local`)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowbit_analytics?schema=public"
VANNA_API_BASE_URL="http://localhost:8000"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_BASE="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Vanna (`services/vanna/.env`)
```env
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/flowbit_analytics"
GROQ_API_KEY="your-groq-api-key-here"
PORT=8000
```

**⚠️ Important:** Get your Groq API key from https://console.groq.com/

## Step 5: Start Services

### Terminal 1 - Vanna AI
```bash
cd services/vanna
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Terminal 2 - Backend API
```bash
npm run dev --filter=api
```

### Terminal 3 - Frontend
```bash
npm run dev --filter=web
```

## Step 6: Open Browser

Visit: **http://localhost:3000**

You should see:
- ✅ Analytics Dashboard with charts and metrics
- ✅ Chat with Data tab for natural language queries

## Test Chat Feature

1. Click "Chat with Data" tab
2. Try: "What's the total spend in the last 90 days?"
3. See SQL + results!

## Troubleshooting

**Database not connecting?**
```bash
docker-compose restart postgres
```

**Port already in use?**
Change PORT in respective .env files

**Python errors?**
```bash
cd services/vanna
pip install -r requirements.txt --force-reinstall
```

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed setup
- Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Read [CHAT_WORKFLOW.md](./CHAT_WORKFLOW.md) for chat feature explanation

Happy coding! 🚀


# Complete Setup Guide

This guide will walk you through setting up the entire Flowbit AI Analytics platform from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Docker** and Docker Compose (for PostgreSQL)
- **Groq API Key** ([Get one here](https://console.groq.com/))

## Step-by-Step Setup

### 1. Clone and Install Dependencies

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

### 2. Start PostgreSQL Database

```bash
# Start PostgreSQL using Docker Compose
docker-compose up -d

# Verify it's running
docker ps
```

The database will be available at `localhost:5432` with:
- Username: `postgres`
- Password: `postgres`
- Database: `flowbit_analytics`

### 3. Configure Environment Variables

#### Backend API (`apps/api/.env.local`)

Create `apps/api/.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowbit_analytics?schema=public"
VANNA_API_BASE_URL="http://localhost:8000"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (`apps/web/.env.local`)

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_BASE="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Vanna AI Service (`services/vanna/.env`)

Create `services/vanna/.env`:

```env
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/flowbit_analytics"
GROQ_API_KEY="your-groq-api-key-here"
PORT=8000
VANNA_API_KEY=""
```

**Important:** Replace `your-groq-api-key-here` with your actual Groq API key.

### 4. Set Up Database

```bash
# Generate Prisma client
cd apps/api
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed

cd ../..
```

### 5. Start All Services

You'll need **3 terminal windows**:

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

# Install Python dependencies
pip install -r requirements.txt

# Start the service
uvicorn main:app --reload --port 8000
```

The Vanna service will be available at `http://localhost:8000`

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

The API will be available at `http://localhost:3001`

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

The frontend will be available at `http://localhost:3000`

### 6. Verify Everything Works

1. **Database**: Check that tables were created:
   ```bash
   cd apps/api
   npx prisma studio
   ```
   This opens Prisma Studio where you can view your data.

2. **Backend API**: Visit `http://localhost:3001/health` - should return `{"status":"ok"}`

3. **Vanna AI**: Visit `http://localhost:8000/health` - should return `{"status":"ok","service":"vanna-ai"}`

4. **Frontend**: Visit `http://localhost:3000` - should show the dashboard

## Testing the Chat with Data Feature

1. Navigate to the "Chat with Data" tab in the frontend
2. Try asking: "What's the total spend in the last 90 days?"
3. The system should:
   - Generate SQL query
   - Execute it on the database
   - Display results

## Troubleshooting

### Database Connection Issues

If you can't connect to PostgreSQL:

```bash
# Check if Docker container is running
docker ps

# Check logs
docker-compose logs postgres

# Restart the container
docker-compose restart postgres
```

### Prisma Issues

```bash
# Reset the database (WARNING: deletes all data)
cd apps/api
npx prisma migrate reset

# Regenerate Prisma client
npx prisma generate
```

### Python/Vanna Issues

```bash
# Make sure you're using Python 3.10+
python --version

# Reinstall dependencies
cd services/vanna
pip install -r requirements.txt --force-reinstall
```

### Port Already in Use

If a port is already in use:

- Change `PORT` in the respective `.env` file
- Update `VANNA_API_BASE_URL` in `apps/api/.env.local` if you change Vanna's port
- Update `NEXT_PUBLIC_API_BASE` in `apps/web/.env.local` if you change API's port

## Production Deployment

### Frontend & Backend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Vanna AI (Render/Railway)

1. Create a new Python service
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables
5. Deploy

### Database (Production)

Use a managed PostgreSQL service:
- **Supabase** (free tier available)
- **Neon** (serverless PostgreSQL)
- **Railway** (includes PostgreSQL)
- **DigitalOcean** (managed databases)

Update `DATABASE_URL` in all services to point to your production database.

## Project Structure

```
.
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── app/         # Next.js app router pages
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities and API client
│   └── api/             # Express backend
│       ├── src/
│       │   ├── routes/  # API route handlers
│       │   └── lib/     # Prisma client
│       └── prisma/      # Database schema and migrations
├── services/
│   └── vanna/           # Python FastAPI service
│       ├── main.py      # FastAPI application
│       └── requirements.txt
├── data/
│   └── Analytics_Test_Data.json  # Sample data
├── docker-compose.yml   # PostgreSQL container
└── package.json         # Root package.json with Turborepo
```

## Next Steps

- Customize the dashboard design
- Add more chart types
- Enhance the chat interface
- Add authentication
- Set up CI/CD pipeline

## Support

If you encounter any issues, check:
1. All environment variables are set correctly
2. All services are running
3. Database is accessible
4. Groq API key is valid

Good luck with your project! 🚀


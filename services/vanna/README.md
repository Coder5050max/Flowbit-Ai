# Vanna AI Service

Python FastAPI service for natural language to SQL conversion using Groq LLM.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variables (copy `.env.example` to `.env` and fill in values)

4. Run the service:
```bash
uvicorn main:app --reload --port 8000
```

The service will be available at http://localhost:8000

## API Endpoints

- `GET /health` - Health check
- `POST /query` - Process natural language query

### Query Request
```json
{
  "query": "What's the total spend in the last 90 days?"
}
```

### Query Response
```json
{
  "sql": "SELECT SUM(total) as total_spend FROM invoices WHERE issue_date >= CURRENT_DATE - INTERVAL '90 days'",
  "data": [
    {"total_spend": 12345.67}
  ],
  "error": null
}
```


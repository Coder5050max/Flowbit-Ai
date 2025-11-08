from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from groq import Groq
import psycopg2
from psycopg2.extras import RealDictCursor
import json

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

app = FastAPI(title="Vanna AI Query Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("WARNING: DATABASE_URL environment variable is not set")

# Parse PostgreSQL URL for psycopg2
# Handle both formats: postgresql+psycopg:// and postgresql://
# Neon and most cloud providers require SSL, so we ensure sslmode is set
if DATABASE_URL:
    # Replace postgresql+psycopg:// with postgresql:// for psycopg2
    db_url = DATABASE_URL.replace("postgresql+psycopg://", "postgresql://")
    
    # Ensure SSL mode is set for cloud providers (Neon, Render, etc.)
    # If sslmode is not in the URL, add it
    if "sslmode=" not in db_url:
        # Add sslmode parameter
        if "?" in db_url:
            db_url += "&sslmode=require"
        else:
            db_url += "?sslmode=require"
else:
    db_url = None

# Groq API setup
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY environment variable is not set")
    groq_client = None
else:
    groq_client = Groq(api_key=GROQ_API_KEY)

# Database schema information for LLM
SCHEMA_DESCRIPTION = """
The database contains the following tables:
- vendors: Vendor information (id, name, email, phone, address, tax_id)
- customers: Customer information (id, name, email, phone, address, tax_id)
- invoices: Invoice headers (id, invoice_number, vendor_id, customer_id, issue_date, due_date, status, subtotal, tax, total, currency)
- line_items: Invoice line items (id, invoice_id, description, category, quantity, unit_price, amount)
- payments: Payment records (id, invoice_id, amount, payment_date, payment_method, reference_number)

Relationships:
- invoices.vendor_id -> vendors.id
- invoices.customer_id -> customers.id
- line_items.invoice_id -> invoices.id
- payments.invoice_id -> invoices.id

Status values: 'paid', 'pending', 'overdue', 'draft'
"""


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    sql: str
    data: list
    error: Optional[str] = None


def execute_sql(sql: str):
    """Execute SQL query and return results"""
    if not db_url:
        raise Exception("DATABASE_URL is not configured")
    try:
        # Parse connection string and handle SSL properly
        # psycopg2.connect can handle connection strings directly
        # But we'll use it with proper error handling
        conn = psycopg2.connect(
            db_url,
            connect_timeout=10  # 10 second timeout
        )
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(sql)
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Convert to list of dicts
        return [dict(row) for row in results]
    except psycopg2.OperationalError as e:
        raise Exception(f"Database connection error: {str(e)}. Check DATABASE_URL and network connectivity.")
    except psycopg2.Error as e:
        raise Exception(f"Database error: {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error: {str(e)}")


def generate_sql_with_groq(query: str) -> str:
    """Generate SQL using Groq LLM"""
    if not groq_client:
        raise Exception("GROQ_API_KEY is not configured")
    
    prompt = f"""
You are a SQL expert. Given the following database schema and a natural language query, generate a valid PostgreSQL SQL query.

Database Schema:
{SCHEMA_DESCRIPTION}

Natural Language Query: {query}

Generate ONLY the SQL query without any explanation or markdown formatting. Return just the SQL statement.

Example queries:
- "What's the total spend in the last 90 days?" -> SELECT SUM(total) as total_spend FROM invoices WHERE issue_date >= CURRENT_DATE - INTERVAL '90 days';
- "List top 5 vendors by spend" -> SELECT v.name, SUM(i.total) as total_spend FROM vendors v JOIN invoices i ON v.id = i.vendor_id GROUP BY v.id, v.name ORDER BY total_spend DESC LIMIT 5;
- "Show overdue invoices as of today" -> SELECT * FROM invoices WHERE status = 'overdue' AND due_date < CURRENT_DATE;

SQL Query:
"""
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a SQL expert. Generate valid PostgreSQL queries based on natural language questions. Return only the SQL query, no explanations."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
        )
        
        sql = chat_completion.choices[0].message.content.strip()
        
        # Clean up SQL (remove markdown code blocks if present)
        if sql.startswith("```sql"):
            sql = sql[6:]
        if sql.startswith("```"):
            sql = sql[3:]
        if sql.endswith("```"):
            sql = sql[:-3]
        sql = sql.strip()
        
        return sql
    except Exception as e:
        raise Exception(f"Groq API error: {str(e)}")


@app.get("/")
async def root():
    return {
        "message": "Vanna AI Query Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "query": "/query (POST)"
        },
        "status": "running" if DATABASE_URL and GROQ_API_KEY else "configured"
    }

@app.get("/health")
async def health():
    checks = {
        "service": "vanna-ai",
        "status": "ok",
        "database_configured": DATABASE_URL is not None,
        "groq_configured": GROQ_API_KEY is not None,
        "database_connected": False
    }
    
    # Test database connection if configured
    if DATABASE_URL and db_url:
        try:
            conn = psycopg2.connect(db_url, connect_timeout=5)
            conn.close()
            checks["database_connected"] = True
        except Exception as e:
            checks["database_connected"] = False
            checks["database_error"] = str(e)
            checks["status"] = "error"
    
    if not DATABASE_URL or not GROQ_API_KEY:
        checks["status"] = "warning"
        checks["message"] = "Some environment variables are missing"
    elif not checks.get("database_connected", False):
        checks["status"] = "error"
        checks["message"] = "Database connection failed"
    
    return checks


@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """
    Process natural language query and return SQL + results
    """
    try:
        # Generate SQL using Groq
        sql = generate_sql_with_groq(request.query)
        
        # Execute SQL
        try:
            data = execute_sql(sql)
        except Exception as db_error:
            return QueryResponse(
                sql=sql,
                data=[],
                error=f"SQL execution failed: {str(db_error)}"
            )
        
        return QueryResponse(
            sql=sql,
            data=data,
            error=None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)


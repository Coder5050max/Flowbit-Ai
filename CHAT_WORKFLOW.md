# Chat with Data Workflow

This document explains how the "Chat with Data" feature works end-to-end.

## Overview

The Chat with Data feature allows users to ask natural language questions about their invoice and vendor data. The system converts these questions into SQL queries, executes them on the PostgreSQL database, and returns the results.

## Architecture

```
User Input (Frontend)
    ↓
Backend API (/api/chat-with-data)
    ↓
Vanna AI Service (Python FastAPI)
    ↓
Groq LLM (SQL Generation)
    ↓
PostgreSQL Database (Query Execution)
    ↓
Results (Back to Frontend)
```

## Step-by-Step Flow

### 1. User Input (Frontend)

The user types a natural language question in the chat interface, for example:
- "What's the total spend in the last 90 days?"
- "List top 5 vendors by spend"
- "Show overdue invoices as of today"

**Location:** `apps/web/components/chat-with-data.tsx`

### 2. Frontend API Call

The frontend sends a POST request to the backend API:

```typescript
POST /api/chat-with-data
Body: { "query": "What's the total spend in the last 90 days?" }
```

**Location:** `apps/web/lib/api.ts` - `chatWithData()` function

### 3. Backend Proxy

The backend API receives the request and proxies it to the Vanna AI service:

**Location:** `apps/api/src/routes/chat.ts`

```typescript
POST http://localhost:8000/query
Body: { "query": "What's the total spend in the last 90 days?" }
```

### 4. Vanna AI Service

The Vanna AI service (Python FastAPI) processes the query:

**Location:** `services/vanna/main.py`

#### 4.1 SQL Generation with Groq

The service uses Groq's LLM to generate SQL:

```python
def generate_sql_with_groq(query: str) -> str:
    prompt = f"""
    Database Schema:
    {SCHEMA_DESCRIPTION}
    
    Natural Language Query: {query}
    
    Generate ONLY the SQL query...
    """
    
    response = groq_client.chat.completions.create(
        model="mixtral-8x7b-32768",
        messages=[...]
    )
    
    return sql_query
```

The LLM is provided with:
- Database schema information
- Table relationships
- Example queries
- The user's natural language question

#### 4.2 SQL Execution

The generated SQL is executed on the PostgreSQL database:

```python
def execute_sql(sql: str):
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(sql)
    results = cursor.fetchall()
    return [dict(row) for row in results]
```

### 5. Response Format

The Vanna service returns:

```json
{
  "sql": "SELECT SUM(total) FROM invoices WHERE ...",
  "data": [
    { "total_spend": "123456.78" }
  ],
  "error": null
}
```

### 6. Frontend Display

The frontend receives the response and displays:
- **Generated SQL**: Shows the SQL query that was generated
- **Results Table**: Displays the query results in a table format
- **Error Messages**: If any errors occurred

## Database Schema Context

The Vanna AI service is trained with the following schema information:

```python
SCHEMA_DESCRIPTION = """
The database contains the following tables:
- vendors: Vendor information
- customers: Customer information
- invoices: Invoice headers
- line_items: Invoice line items
- payments: Payment records

Relationships:
- invoices.vendor_id -> vendors.id
- invoices.customer_id -> customers.id
- line_items.invoice_id -> invoices.id
- payments.invoice_id -> invoices.id
"""
```

This context helps the LLM understand the database structure and generate accurate SQL queries.

## Example Queries

### Example 1: Total Spend

**User Query:** "What's the total spend in the last 90 days?"

**Generated SQL:**
```sql
SELECT SUM(total) as total_spend 
FROM invoices 
WHERE issue_date >= CURRENT_DATE - INTERVAL '90 days';
```

**Result:**
```json
{
  "sql": "SELECT SUM(total)...",
  "data": [{ "total_spend": "123456.78" }]
}
```

### Example 2: Top Vendors

**User Query:** "List top 5 vendors by spend"

**Generated SQL:**
```sql
SELECT v.name, SUM(i.total) as total_spend 
FROM vendors v 
JOIN invoices i ON v.id = i.vendor_id 
GROUP BY v.id, v.name 
ORDER BY total_spend DESC 
LIMIT 5;
```

### Example 3: Overdue Invoices

**User Query:** "Show overdue invoices as of today"

**Generated SQL:**
```sql
SELECT * 
FROM invoices 
WHERE status = 'overdue' 
AND due_date < CURRENT_DATE;
```

## Error Handling

### SQL Generation Errors

If Groq fails to generate SQL:
- Error is caught and returned in the response
- Frontend displays error message

### SQL Execution Errors

If the generated SQL fails to execute:
- Database error is caught
- SQL is still returned (for debugging)
- Error message is included in response

### Network Errors

If the Vanna service is unreachable:
- Backend returns 500 error
- Frontend displays connection error

## Configuration

### Environment Variables

**Vanna Service (`services/vanna/.env`):**
```env
DATABASE_URL=postgresql+psycopg://...
GROQ_API_KEY=your-key-here
PORT=8000
```

**Backend API (`apps/api/.env.local`):**
```env
VANNA_API_BASE_URL=http://localhost:8000
```

## Improvements & Extensions

Potential enhancements:

1. **Query Caching**: Cache common queries to reduce LLM calls
2. **Query History**: Store user queries for reference
3. **Query Validation**: Validate SQL before execution
4. **Chart Generation**: Automatically generate charts for numeric results
5. **Multi-table Joins**: Better handling of complex queries
6. **Query Suggestions**: Suggest similar queries based on history
7. **Streaming Responses**: Stream SQL generation and results
8. **Query Explanation**: Explain what the SQL query does in plain language

## Security Considerations

1. **SQL Injection**: The generated SQL is executed directly. Consider:
   - Query validation
   - Read-only database user
   - Query timeout limits
   - Result size limits

2. **API Keys**: Keep Groq API key secure in environment variables

3. **Rate Limiting**: Implement rate limiting to prevent abuse

4. **Input Sanitization**: Validate and sanitize user input

## Troubleshooting

### "Failed to process query"

- Check if Vanna service is running
- Verify `VANNA_API_BASE_URL` is correct
- Check Vanna service logs

### "SQL execution failed"

- Verify database connection
- Check if generated SQL is valid
- Review database logs

### "Groq API error"

- Verify `GROQ_API_KEY` is set correctly
- Check API key quota/limits
- Review Groq API status

## Testing

Test the workflow:

1. Start all services (database, API, Vanna, frontend)
2. Navigate to "Chat with Data" tab
3. Try example queries
4. Verify SQL is generated correctly
5. Verify results match expected data


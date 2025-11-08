# API Documentation

This document describes all available API endpoints in the Flowbit AI Analytics platform.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: Your deployed API URL

## Endpoints

### Health Check

#### `GET /health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Statistics

#### `GET /api/stats`

Get overview statistics for the dashboard cards.

**Response:**
```json
{
  "totalSpend": 123456.78,
  "totalInvoices": 150,
  "documentsUploaded": 200,
  "averageInvoiceValue": 822.38
}
```

**Description:**
- `totalSpend`: Total invoice amount for the current year (YTD)
- `totalInvoices`: Number of invoices processed this year
- `documentsUploaded`: Total number of invoices in the system
- `averageInvoiceValue`: Average invoice total for the current year

---

### Invoice Trends

#### `GET /api/invoice-trends`

Get monthly invoice trends (count and value).

**Response:**
```json
[
  {
    "month": "2024-01",
    "invoiceCount": 25,
    "totalValue": 50000.00
  },
  {
    "month": "2024-02",
    "invoiceCount": 30,
    "totalValue": 60000.00
  }
]
```

---

### Top Vendors

#### `GET /api/vendors/top10`

Get top 10 vendors by total spend.

**Response:**
```json
[
  {
    "id": "vendor-uuid",
    "name": "Acme Corporation",
    "totalSpend": 50000.00
  },
  {
    "id": "vendor-uuid-2",
    "name": "Tech Solutions Inc",
    "totalSpend": 30000.00
  }
]
```

---

### Category Spend

#### `GET /api/category-spend`

Get spending grouped by category.

**Response:**
```json
[
  {
    "category": "Software",
    "spend": 40000.00
  },
  {
    "category": "Services",
    "spend": 30000.00
  }
]
```

---

### Cash Outflow Forecast

#### `GET /api/cash-outflow`

Get expected cash outflow by date range.

**Query Parameters:**
- `startDate` (optional): Start date in ISO format (default: today)
- `endDate` (optional): End date in ISO format (default: 90 days from now)

**Example:**
```
GET /api/cash-outflow?startDate=2024-01-01&endDate=2024-03-31
```

**Response:**
```json
[
  {
    "date": "2024-02-15",
    "amount": 10000.00
  },
  {
    "date": "2024-03-01",
    "amount": 5000.00
  }
]
```

---

### Invoices

#### `GET /api/invoices`

Get paginated list of invoices with filtering and sorting.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `search` (optional): Search in invoice number or vendor name
- `status` (optional): Filter by status (`paid`, `pending`, `overdue`, `draft`)
- `vendorId` (optional): Filter by vendor ID
- `sortBy` (optional): Field to sort by (default: `issueDate`)
- `sortOrder` (optional): Sort order `asc` or `desc` (default: `desc`)

**Example:**
```
GET /api/invoices?page=1&limit=20&search=INV&status=pending&sortBy=issueDate&sortOrder=desc
```

**Response:**
```json
{
  "invoices": [
    {
      "id": "invoice-uuid",
      "invoiceNumber": "INV-2024-001",
      "vendor": "Acme Corporation",
      "vendorId": "vendor-uuid",
      "customer": "Global Enterprises",
      "issueDate": "2024-01-15T00:00:00.000Z",
      "dueDate": "2024-02-15T00:00:00.000Z",
      "amount": 12096.00,
      "status": "paid",
      "currency": "USD"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### Chat with Data

#### `POST /api/chat-with-data`

Process natural language query and return SQL + results.

**Request Body:**
```json
{
  "query": "What's the total spend in the last 90 days?"
}
```

**Response:**
```json
{
  "sql": "SELECT SUM(total) as total_spend FROM invoices WHERE issue_date >= CURRENT_DATE - INTERVAL '90 days'",
  "data": [
    {
      "total_spend": "123456.78"
    }
  ],
  "error": null
}
```

**Error Response:**
```json
{
  "sql": "SELECT ...",
  "data": [],
  "error": "SQL execution failed: ..."
}
```

**Note:** This endpoint proxies requests to the Vanna AI service. Ensure the Vanna service is running and accessible.

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

**Status Codes:**
- `400` - Bad Request (invalid parameters)
- `500` - Internal Server Error

---

## CORS

The API is configured to accept requests from:
- Development: `http://localhost:3000`
- Production: Your frontend domain (configured via `FRONTEND_URL` environment variable)

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding rate limiting middleware.

---

## Authentication

Currently, there is no authentication implemented. For production, add:
- JWT tokens
- API keys
- OAuth2
- Or your preferred authentication method


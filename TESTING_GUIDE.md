# 🧪 Complete Testing Guide for Flowbit AI

This guide will help you test all three deployed services: Frontend, Backend API, and Vanna AI service.

## 📋 Prerequisites

Before testing, ensure you have:
- ✅ All three services deployed and running
- ✅ Environment variables properly configured
- ✅ Database migrations run (if needed)
- ✅ Database seeded with test data (optional but recommended)

---

## 🔍 Step 1: Test Individual Services

### 1.1 Test Backend API Health Check

**Endpoint:** `GET /health`

```bash
# Replace YOUR_BACKEND_URL with your actual Render backend URL
curl https://YOUR_BACKEND_URL.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-08T16:30:00.000Z"
}
```

✅ **Success:** If you get a 200 status with `"status": "ok"`, your backend is running!

---

### 1.2 Test Vanna AI Service

**Endpoint:** `POST /query`

```bash
# Replace YOUR_VANNA_URL with your actual Vanna service URL
curl -X POST https://YOUR_VANNA_URL.onrender.com/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How many invoices are there?"}'
```

**Expected Response:**
```json
{
  "sql": "SELECT COUNT(*) FROM invoices",
  "results": [...]
}
```

✅ **Success:** If you get SQL and results, Vanna is working!

---

### 1.3 Test Frontend

Simply open your frontend URL in a browser:
```
https://YOUR_FRONTEND_URL.vercel.app
```

✅ **Success:** If the page loads without errors, frontend is working!

---

## 🔌 Step 2: Test Backend API Endpoints

Replace `YOUR_BACKEND_URL` with your actual backend URL in all examples below.

### 2.1 Test Stats Endpoint

```bash
curl https://YOUR_BACKEND_URL.onrender.com/api/stats
```

**Expected Response:**
```json
{
  "totalSpendYTD": 123456.78,
  "totalSpendCurrentMonth": 12345.67,
  "totalSpendLastMonth": 23456.78,
  "totalInvoicesYTD": 150,
  "totalInvoicesCurrentMonth": 15,
  "totalInvoicesLastMonth": 20,
  "averageInvoiceValue": 823.05,
  "pendingInvoices": 5,
  "overdueInvoices": 2
}
```

---

### 2.2 Test Invoice Trends

```bash
curl https://YOUR_BACKEND_URL.onrender.com/api/invoice-trends
```

**Expected Response:**
```json
{
  "trends": [
    {
      "month": "2025-01",
      "total": 12345.67,
      "count": 15
    },
    ...
  ]
}
```

---

### 2.3 Test Top Vendors

```bash
curl https://YOUR_BACKEND_URL.onrender.com/api/vendors/top10
```

**Expected Response:**
```json
{
  "vendors": [
    {
      "vendorId": "uuid",
      "vendorName": "Vendor Name",
      "totalSpend": 12345.67,
      "invoiceCount": 10
    },
    ...
  ]
}
```

---

### 2.4 Test Category Spend

```bash
curl https://YOUR_BACKEND_URL.onrender.com/api/category-spend
```

**Expected Response:**
```json
{
  "categories": [
    {
      "category": "Office Supplies",
      "total": 1234.56,
      "count": 5
    },
    ...
  ]
}
```

---

### 2.5 Test Cash Outflow

```bash
curl "https://YOUR_BACKEND_URL.onrender.com/api/cash-outflow?startDate=2025-01-01&endDate=2025-12-31"
```

**Expected Response:**
```json
{
  "forecast": [
    {
      "date": "2025-01-15",
      "amount": 1234.56,
      "invoiceCount": 3
    },
    ...
  ]
}
```

---

### 2.6 Test Invoices List

```bash
# Basic request
curl https://YOUR_BACKEND_URL.onrender.com/api/invoices

# With pagination
curl "https://YOUR_BACKEND_URL.onrender.com/api/invoices?page=1&limit=10"

# With search
curl "https://YOUR_BACKEND_URL.onrender.com/api/invoices?search=INV-001"

# With filters
curl "https://YOUR_BACKEND_URL.onrender.com/api/invoices?status=pending&sortBy=issueDate&sortOrder=desc"
```

**Expected Response:**
```json
{
  "invoices": [
    {
      "id": "uuid",
      "invoiceNumber": "INV-001",
      "vendor": "Vendor Name",
      "vendorId": "uuid",
      "customer": "Customer Name",
      "issueDate": "2025-01-15T00:00:00.000Z",
      "dueDate": "2025-02-15T00:00:00.000Z",
      "amount": 1234.56,
      "status": "pending",
      "currency": "USD"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

---

### 2.7 Test Chat with Data (AI Query)

```bash
curl -X POST https://YOUR_BACKEND_URL.onrender.com/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the total spend this month?"}'
```

**Expected Response:**
```json
{
  "sql": "SELECT SUM(total) FROM invoices WHERE issue_date >= '2025-11-01'",
  "results": [
    {
      "sum": "12345.67"
    }
  ]
}
```

---

## 🌐 Step 3: Test Full Integration

### 3.1 Test Frontend → Backend Connection

1. Open your frontend URL in a browser
2. Open browser DevTools (F12) → Network tab
3. Navigate through the dashboard
4. Check that API calls are being made to your backend
5. Verify responses are successful (status 200)

**What to check:**
- ✅ Dashboard loads with data
- ✅ Charts render correctly
- ✅ No CORS errors in console
- ✅ API calls return 200 status

---

### 3.2 Test Chat with Data Feature

1. Go to the Chat page in your frontend
2. Type a natural language query: "Show me top 5 vendors by spend"
3. Click submit
4. Verify:
   - ✅ Query is sent to backend
   - ✅ Backend forwards to Vanna service
   - ✅ SQL is generated
   - ✅ Results are displayed
   - ✅ Chart/table renders correctly

---

## 🐛 Step 4: Common Issues & Troubleshooting

### Issue: CORS Errors

**Symptoms:** Browser console shows CORS errors

**Solution:**
1. Check that `FRONTEND_URL` in backend environment variables matches your frontend URL exactly
2. Ensure no trailing slashes
3. If using multiple frontend URLs, separate with commas: `https://app1.com,https://app2.com`

---

### Issue: 404 Not Found

**Symptoms:** API calls return 404

**Solution:**
1. Verify the endpoint URL is correct
2. Check that routes are properly registered in `server.ts`
3. Ensure backend is deployed and running

---

### Issue: Database Connection Errors

**Symptoms:** 500 errors, "Database connection failed"

**Solution:**
1. Verify `DATABASE_URL` is set correctly in Render
2. Check database is running and accessible
3. Run migrations: `npm run migrate:deploy` in Render shell
4. Verify database has data (seed if needed)

---

### Issue: Vanna Service Not Responding

**Symptoms:** Chat queries fail, "Failed to process query"

**Solution:**
1. Verify `VANNA_API_BASE_URL` in backend matches Vanna service URL
2. Test Vanna service directly (Step 1.2)
3. Check Vanna service logs in Render
4. Verify `GROQ_API_KEY` is set in Vanna service

---

### Issue: Empty Data / No Results

**Symptoms:** API returns empty arrays or zeros

**Solution:**
1. Check if database has data
2. Run seed script if needed
3. Verify date filters are correct
4. Check database connection

---

## 📊 Step 5: Performance Testing

### Load Testing (Optional)

Use a tool like Apache Bench or k6:

```bash
# Test health endpoint
ab -n 100 -c 10 https://YOUR_BACKEND_URL.onrender.com/health

# Test stats endpoint
ab -n 50 -c 5 https://YOUR_BACKEND_URL.onrender.com/api/stats
```

---

## ✅ Step 6: Final Checklist

Before considering deployment complete, verify:

- [ ] Backend health check returns 200
- [ ] All API endpoints return data (not errors)
- [ ] Frontend loads without errors
- [ ] Dashboard displays data correctly
- [ ] Charts render properly
- [ ] Chat with Data feature works
- [ ] No CORS errors in browser console
- [ ] Database queries execute successfully
- [ ] Vanna AI generates SQL correctly
- [ ] All environment variables are set correctly

---

## 🎯 Quick Test Script

Save this as `test-api.sh` and run it (replace URLs):

```bash
#!/bin/bash

BACKEND_URL="https://YOUR_BACKEND_URL.onrender.com"
VANNA_URL="https://YOUR_VANNA_URL.onrender.com"

echo "Testing Backend Health..."
curl -s "$BACKEND_URL/health" | jq .

echo -e "\nTesting Stats..."
curl -s "$BACKEND_URL/api/stats" | jq .

echo -e "\nTesting Invoice Trends..."
curl -s "$BACKEND_URL/api/invoice-trends" | jq .

echo -e "\nTesting Top Vendors..."
curl -s "$BACKEND_URL/api/vendors/top10" | jq .

echo -e "\nTesting Chat with Data..."
curl -s -X POST "$BACKEND_URL/api/chat-with-data" \
  -H "Content-Type: application/json" \
  -d '{"query": "How many invoices are there?"}' | jq .
```

---

## 📝 Notes

- All API endpoints return JSON
- Use proper Content-Type headers for POST requests
- Check browser console for frontend errors
- Check Render logs for backend/Vanna errors
- Database should be seeded with test data for meaningful results

---

## 🆘 Need Help?

If you encounter issues:
1. Check Render service logs
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test each service individually first
5. Check database connection and data

Happy Testing! 🚀


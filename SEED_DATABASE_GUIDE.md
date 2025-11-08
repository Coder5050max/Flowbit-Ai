# 🌱 How to Seed Your Database in Production

Your dashboard is showing zeros because the production database is empty. You need to seed it with your `Analytics_Test_Data.json` file.

---

## ✅ Quick Solution: Use the Seed API Endpoint

I've created a seed endpoint that you can call to populate your database.

### Step 1: Make Sure Data File is in Your Repository

The seed script looks for the file at: `data/Analytics_Test_Data.json`

**Verify it's in your repo:**
1. Check that `data/Analytics_Test_Data.json` exists in your GitHub repository
2. If it's not there, add it:
   ```bash
   git add data/Analytics_Test_Data.json
   git commit -m "Add Analytics_Test_Data.json for seeding"
   git push
   ```

---

### Step 2: Wait for Backend to Redeploy

After pushing the seed endpoint code, wait for Render to automatically redeploy your backend (about 1-2 minutes).

---

### Step 3: Call the Seed Endpoint

Once your backend is deployed, call the seed endpoint:

#### Option A: Using curl (from your computer)

```bash
curl -X POST https://your-backend-url.onrender.com/api/seed
```

Replace `your-backend-url` with your actual backend URL (e.g., `flowbit-backend-2.onrender.com`)

#### Option B: Using Browser

1. Open your browser
2. Go to: `https://your-backend-url.onrender.com/api/seed`
3. You'll see an error (because it needs POST), but that's okay - we'll use a tool

#### Option C: Using Postman or Insomnia

1. Create a new POST request
2. URL: `https://your-backend-url.onrender.com/api/seed`
3. Method: POST
4. Click Send

#### Option D: Using PowerShell (Windows)

```powershell
Invoke-WebRequest -Uri "https://your-backend-url.onrender.com/api/seed" -Method POST
```

---

### Step 4: Check the Response

You should see a response like:

```json
{
  "success": true,
  "message": "Database seeded successfully",
  "processed": 150,
  "skipped": 5
}
```

**If you see an error:**
- Check the error message
- Make sure `data/Analytics_Test_Data.json` is in your repository
- Check backend logs in Render for more details

---

### Step 5: Verify Dashboard

1. Go to your frontend: `https://flowbit-ai-web.vercel.app/`
2. Refresh the page
3. You should now see:
   - ✅ Charts with data
   - ✅ Invoice counts
   - ✅ Vendor statistics
   - ✅ Category spending breakdowns

---

## 🔒 Security Note

**After seeding, you should remove or protect the seed endpoint** for security:

1. The endpoint is at `/api/seed`
2. It can be called by anyone who knows the URL
3. After you've seeded once, consider:
   - Removing the route from `server.ts`
   - Or adding authentication
   - Or adding a one-time token check

---

## 🐛 Troubleshooting

### Error: "Analytics_Test_Data.json not found"

**Solution:**
1. Make sure the file is in your repository at `data/Analytics_Test_Data.json`
2. Check that it's not in `.gitignore`
3. Push it to GitHub:
   ```bash
   git add data/Analytics_Test_Data.json
   git commit -m "Add data file"
   git push
   ```
4. Wait for Render to redeploy
5. Try the seed endpoint again

### Error: "Database connection error"

**Solution:**
1. Check that `DATABASE_URL` is set correctly in Render
2. Verify your Neon database is accessible
3. Check backend logs for specific error

### Error: "CORS error"

**Solution:**
- The seed endpoint should work from anywhere (no CORS restrictions)
- If you see CORS errors, check backend logs

### Seed Takes Too Long

**Normal behavior:**
- Processing 100+ invoices can take 1-5 minutes
- The endpoint will return when done
- Check backend logs to see progress

---

## 📋 Complete Checklist

- [ ] `data/Analytics_Test_Data.json` is in your GitHub repository
- [ ] Backend has been redeployed with the seed endpoint
- [ ] Called `POST /api/seed` endpoint
- [ ] Received success response with processed count
- [ ] Refreshed frontend dashboard
- [ ] Dashboard now shows data

---

## 🎯 Quick Command Reference

**Your backend URL:** `https://flowbit-backend-2.onrender.com` (or your actual URL)

**Seed command:**
```bash
curl -X POST https://flowbit-backend-2.onrender.com/api/seed
```

**Check if it worked:**
```bash
curl https://flowbit-backend-2.onrender.com/api/stats
```

Should return data instead of zeros.

---

## 💡 Alternative: Seed Locally

If the API endpoint doesn't work, you can seed locally and it will populate your Neon database:

1. Set `DATABASE_URL` in your local `.env` to your Neon connection string
2. Run:
   ```bash
   cd apps/api
   npm run db:seed
   ```
   Or:
   ```bash
   cd apps/api
   npx prisma db seed
   ```

This will seed your production Neon database directly from your local machine.

---

**Need Help?** Check the backend logs in Render for detailed error messages!


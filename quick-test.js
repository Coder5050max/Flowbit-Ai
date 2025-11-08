/**
 * Quick API Testing Script
 * 
 * Usage: 
 * 1. Update the URLs below with your actual deployed URLs
 * 2. Run: node quick-test.js
 * 
 * Make sure you have node-fetch installed or use Node 18+ (which has fetch built-in)
 */

const BACKEND_URL = process.env.BACKEND_URL || 'https://YOUR_BACKEND_URL.onrender.com';
const VANNA_URL = process.env.VANNA_URL || 'https://YOUR_VANNA_URL.onrender.com';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`\n${colors.blue}Testing: ${name}${colors.reset}`);
    console.log(`URL: ${url}`);
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✅ SUCCESS${colors.reset} (${response.status})`);
      console.log(JSON.stringify(data, null, 2).substring(0, 200) + '...');
      return true;
    } else {
      console.log(`${colors.red}❌ FAILED${colors.reset} (${response.status})`);
      console.log(data);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ ERROR${colors.reset}`);
    console.log(error.message);
    return false;
  }
}

async function runTests() {
  console.log(`${colors.yellow}🚀 Starting API Tests...${colors.reset}`);
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Vanna URL: ${VANNA_URL}`);
  
  const results = {
    passed: 0,
    failed: 0,
  };

  // Test 1: Backend Health Check
  if (await testEndpoint('Backend Health Check', `${BACKEND_URL}/health`)) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 2: Stats Endpoint
  if (await testEndpoint('Stats', `${BACKEND_URL}/api/stats`)) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 3: Invoice Trends
  if (await testEndpoint('Invoice Trends', `${BACKEND_URL}/api/invoice-trends`)) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 4: Top Vendors
  if (await testEndpoint('Top Vendors', `${BACKEND_URL}/api/vendors/top10`)) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 5: Category Spend
  if (await testEndpoint('Category Spend', `${BACKEND_URL}/api/category-spend`)) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 6: Invoices List
  if (await testEndpoint('Invoices List', `${BACKEND_URL}/api/invoices?page=1&limit=5`)) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 7: Chat with Data
  if (await testEndpoint(
    'Chat with Data',
    `${BACKEND_URL}/api/chat-with-data`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'How many invoices are there?' }),
    }
  )) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Summary
  console.log(`\n${colors.yellow}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Test Summary:${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════════════${colors.reset}\n`);
}

// Run tests
runTests().catch(console.error);


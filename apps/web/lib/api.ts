const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchInvoiceTrends() {
  const res = await fetch(`${API_BASE}/api/invoice-trends`);
  if (!res.ok) throw new Error('Failed to fetch invoice trends');
  return res.json();
}

export async function fetchTopVendors() {
  const res = await fetch(`${API_BASE}/api/vendors/top10`);
  if (!res.ok) throw new Error('Failed to fetch top vendors');
  return res.json();
}

export async function fetchCategorySpend() {
  const res = await fetch(`${API_BASE}/api/category-spend`);
  if (!res.ok) throw new Error('Failed to fetch category spend');
  return res.json();
}

export async function fetchCashOutflow(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const res = await fetch(`${API_BASE}/api/cash-outflow?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch cash outflow');
  return res.json();
}

export async function fetchInvoices(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const res = await fetch(`${API_BASE}/api/invoices?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch invoices');
  return res.json();
}

export async function chatWithData(query: string) {
  try {
    const res = await fetch(`${API_BASE}/api/chat-with-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!res.ok) {
      let errorMessage = 'Failed to process query';
      try {
        const error = await res.json();
        errorMessage = error.error || error.details || errorMessage;
      } catch {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return res.json();
  } catch (error: any) {
    // Network errors (CORS, connection refused, etc.)
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      throw new Error(`Cannot connect to API. Check that NEXT_PUBLIC_API_BASE is set correctly. Current: ${API_BASE}`);
    }
    throw error;
  }
}


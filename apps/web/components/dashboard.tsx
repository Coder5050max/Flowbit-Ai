'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchStats, fetchInvoiceTrends, fetchTopVendors, fetchCategorySpend, fetchCashOutflow, fetchInvoices } from '@/lib/api';
import { InvoiceTrendChart } from './charts/invoice-trend-chart';
import { VendorSpendChart } from './charts/vendor-spend-chart';
import { CategorySpendChart } from './charts/category-spend-chart';
import { CashOutflowChart } from './charts/cash-outflow-chart';
import { InvoicesByVendorTable } from './invoices-by-vendor-table';
import { MetricCard } from './metric-card';

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [topVendors, setTopVendors] = useState<any[]>([]);
  const [categorySpend, setCategorySpend] = useState<any[]>([]);
  const [cashOutflow, setCashOutflow] = useState<any[]>([]);
  const [invoicesByVendor, setInvoicesByVendor] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, trendsData, vendorsData, categoryData, outflowData, invoicesData] = await Promise.all([
        fetchStats(),
        fetchInvoiceTrends(),
        fetchTopVendors(),
        fetchCategorySpend(),
        fetchCashOutflow(),
        fetchInvoices({ page: 1, limit: 1000 }),
      ]);

      setStats(statsData);
      setTrends(trendsData);
      setTopVendors(vendorsData);
      setCategorySpend(categoryData);
      setCashOutflow(outflowData);
      
      // Group invoices by vendor for the table
      const vendorMap = new Map();
      invoicesData.invoices.forEach((inv: any) => {
        if (!vendorMap.has(inv.vendor)) {
          vendorMap.set(inv.vendor, {
            vendor: inv.vendor,
            invoiceCount: 0,
            netValue: 0,
            invoices: [],
          });
        }
        const vendorData = vendorMap.get(inv.vendor);
        vendorData.invoiceCount += 1;
        vendorData.netValue += inv.amount;
        vendorData.invoices.push(inv);
      });
      setInvoicesByVendor(Array.from(vendorMap.values()).sort((a, b) => b.netValue - a.netValue));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate trend data for metric cards (simplified - using last 6 months)
  const getTrendData = (currentValue: number, changePercent: number) => {
    const data = [];
    const baseValue = currentValue / (1 + changePercent / 100);
    for (let i = 0; i < 6; i++) {
      data.push(baseValue * (1 + (changePercent / 100) * (i / 5)));
    }
    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  // Get changes from API
  const totalSpendChange = stats?.changes?.totalSpend || 0;
  const totalInvoicesChange = stats?.changes?.totalInvoices || 0;
  const documentsChange = stats?.changes?.documents || 0;
  const avgInvoiceChange = stats?.changes?.averageInvoice || 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards - Top Row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Spend (YTD)"
          value={formatCurrency(stats?.totalSpend || 0)}
          change={`${totalSpendChange >= 0 ? '+' : ''}${totalSpendChange.toFixed(1)}%`}
          changeType={totalSpendChange >= 0 ? "positive" : "negative"}
          trendData={getTrendData(stats?.totalSpend || 0, totalSpendChange)}
        />
        <MetricCard
          title="Total Invoices Processed"
          value={stats?.totalInvoices?.toString() || '0'}
          change={`${totalInvoicesChange >= 0 ? '+' : ''}${totalInvoicesChange.toFixed(1)}%`}
          changeType={totalInvoicesChange >= 0 ? "positive" : "negative"}
          trendData={getTrendData(stats?.totalInvoices || 0, totalInvoicesChange)}
        />
        <MetricCard
          title="Documents Uploaded (This Month)"
          value={stats?.documentsUploadedThisMonth?.toString() || stats?.documentsUploaded?.toString() || '0'}
          change={documentsChange < 0 ? `${Math.abs(documentsChange)} less` : `+${documentsChange}`}
          changeType={documentsChange < 0 ? "negative" : "positive"}
          trendData={getTrendData(stats?.documentsUploadedThisMonth || stats?.documentsUploaded || 0, documentsChange)}
        />
        <MetricCard
          title="Average Invoice Value"
          value={formatCurrency(stats?.averageInvoiceValue || 0)}
          change={`${avgInvoiceChange >= 0 ? '+' : ''}${avgInvoiceChange.toFixed(1)}%`}
          changeType={avgInvoiceChange >= 0 ? "positive" : "negative"}
          trendData={getTrendData(stats?.averageInvoiceValue || 0, avgInvoiceChange)}
        />
      </div>

      {/* Charts - Middle Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="border border-[#E4E4E9] shadow-sm bg-white rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-[#1C1C1C]">Invoice Volume + Value Trend</CardTitle>
            <CardDescription className="text-xs font-medium text-[#64748B]">Invoice count and total spend over 12 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceTrendChart data={trends} />
          </CardContent>
        </Card>
        <Card className="border border-[#E4E4E9] shadow-sm bg-white rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-[#1C1C1C]">Spend by Vendor (Top 10)</CardTitle>
            <CardDescription className="text-xs font-medium text-[#64748B]">Vendor spend with cumulative percentage distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <VendorSpendChart data={topVendors} />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Table - Bottom Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="border border-[#E4E4E9] shadow-sm bg-white rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-[#1C1C1C]">Spend by Category</CardTitle>
            <CardDescription className="text-xs font-medium text-[#64748B]">Distribution of spending across different categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <CategorySpendChart data={categorySpend} />
          </CardContent>
        </Card>
        <Card className="border border-[#E4E4E9] shadow-sm bg-white rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-[#1C1C1C]">Cash Outflow Forecast</CardTitle>
            <CardDescription className="text-xs font-medium text-[#64748B]">Expected payment obligations grouped by due date ranges.</CardDescription>
          </CardHeader>
          <CardContent>
            <CashOutflowChart data={cashOutflow} />
          </CardContent>
        </Card>
        <Card className="border border-[#E4E4E9] shadow-sm bg-white rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-[#1C1C1C]">Invoices by Vendor</CardTitle>
            <CardDescription className="text-xs font-medium text-[#64748B]">Top vendors by invoice count and net value.</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoicesByVendorTable data={invoicesByVendor} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

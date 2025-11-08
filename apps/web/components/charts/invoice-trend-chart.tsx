'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendData {
  month: string;
  invoiceCount: number;
  totalValue: number;
}

export function InvoiceTrendChart({ data }: { data: TrendData[] }) {
  // Format month labels (e.g., "2024-01" -> "Jan")
  const formattedData = data.map(item => ({
    ...item,
    monthLabel: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
  }));

  // Calculate max values for proper Y-axis scaling
  const maxInvoiceCount = Math.max(...formattedData.map(d => d.invoiceCount), 0);
  const maxTotalValue = Math.max(...formattedData.map(d => d.totalValue), 0);
  
  // Set Y-axis domains with padding
  const leftAxisMax = maxInvoiceCount > 0 ? Math.ceil(maxInvoiceCount * 1.1) : 10;
  const rightAxisMax = maxTotalValue > 0 ? Math.ceil(maxTotalValue * 1.1) : 1000;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey="monthLabel" 
          stroke="#666666"
          style={{ fontSize: '10px', fontFamily: 'Inter' }}
          tick={{ fill: '#666666' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          yAxisId="left"
          domain={[0, leftAxisMax]}
          stroke="#666666"
          style={{ fontSize: '10px', fontFamily: 'Inter' }}
          tick={{ fill: '#666666' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          domain={[0, rightAxisMax]}
          stroke="#666666"
          style={{ fontSize: '10px', fontFamily: 'Inter' }}
          tick={{ fill: '#666666' }}
          tickFormatter={(value) => {
            if (value >= 1000) {
              return `€${(value / 1000).toFixed(0)}k`;
            }
            return `€${value}`;
          }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #E4E4E9',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0px 12px 34px -10px rgba(58, 77, 233, 0.15)'
          }}
          formatter={(value: any, name: string) => {
            if (name === 'Invoice count') {
              return [value, name];
            }
            return [formatCurrency(value), name];
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="invoiceCount"
          stroke="#1B1464"
          strokeWidth={3}
          name="Invoice count"
          dot={false}
          activeDot={{ r: 4, fill: '#1E1A71', stroke: 'white', strokeWidth: 2 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="totalValue"
          stroke="rgba(27, 20, 100, 0.26)"
          strokeWidth={3}
          name="Total Spend"
          dot={false}
          activeDot={{ r: 4, fill: 'white', stroke: '#1B1464', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

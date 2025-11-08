'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OutflowData {
  date: string;
  amount: number;
}

export function CashOutflowChart({ data }: { data: OutflowData[] }) {
  // Backend now returns data already grouped by date ranges
  // Format: [{ date: '0-7 days', amount: 443 }, ...]
  const ranges = data && data.length > 0 
    ? data.map(item => ({
        label: item.date,
        amount: item.amount,
      }))
    : [
        { label: '0-7 days', amount: 0 },
        { label: '8-30 days', amount: 0 },
        { label: '31-60 days', amount: 0 },
        { label: '60+ days', amount: 0 },
      ];
  
  // Find max amount for Y-axis scaling
  const maxAmount = Math.max(...ranges.map(r => r.amount), 0);
  // Calculate appropriate Y-axis domain with some padding
  const yAxisMax = maxAmount > 0 ? Math.ceil(maxAmount * 1.1) : 1000;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={ranges} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="label" 
          stroke="#666666"
          style={{ fontSize: '10px', fontFamily: 'Inter' }}
          tick={{ fill: '#666666' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          domain={[0, yAxisMax]}
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
          formatter={(value: number) => formatCurrency(value)}
          labelFormatter={(label) => `Due Date Range: ${label}`}
        />
        <Bar 
          dataKey="amount" 
          fill="#314CFF" 
          name="Expected Outflow"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

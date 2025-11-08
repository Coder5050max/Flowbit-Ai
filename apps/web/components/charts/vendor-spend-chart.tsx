'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VendorData {
  name: string;
  totalSpend: number;
}

export function VendorSpendChart({ data }: { data: VendorData[] }) {
  // Take top 10 and format for display
  const top10 = data.slice(0, 10).map(v => ({
    name: v.name.length > 20 ? v.name.substring(0, 20) + '...' : v.name,
    spend: v.totalSpend,
  }));

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
      <BarChart data={top10} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          type="number" 
          stroke="#666666"
          style={{ fontSize: '10px', fontFamily: 'Inter' }}
          tick={{ fill: '#666666' }}
          tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={100}
          stroke="#666666"
          style={{ fontSize: '10px', fontFamily: 'Inter' }}
          tick={{ fill: '#666666' }}
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
        />
        <Bar 
          dataKey="spend" 
          fill="#314CFF" 
          name="Vendor Spend"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

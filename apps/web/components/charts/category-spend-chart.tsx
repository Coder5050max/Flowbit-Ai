'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryData {
  category: string;
  spend: number;
}

// Figma colors from the design
const COLORS = ['#2B4DED', '#F79661', '#FFD1A7', '#FF9E69', '#BDBCD6', '#8B5CF6'];

export function CategorySpendChart({ data }: { data: CategoryData[] }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={50}
          fill="#8884d8"
          dataKey="spend"
          nameKey="category"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
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
        <Legend 
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => (
            <span style={{ color: '#000000', fontSize: '14px', fontFamily: 'Inter', fontWeight: 500, opacity: 0.5 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

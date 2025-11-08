'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  trendData: number[];
}

export function MetricCard({ title, value, change, changeType, trendData }: MetricCardProps) {
  // Determine image source based on trend type
  const trendImageSrc = changeType === 'positive' ? '/up.png' : '/down.jpg';

  return (
    <Card className="border border-[#E4E4E9] shadow-sm relative bg-white">
      <CardContent className="p-4">
        {/* Title and Value Section */}
        <div className="mb-7">
          <div className="text-xs font-medium text-[#000000] mb-1">{title}</div>
          <div className="text-xl font-semibold text-[#000000] leading-tight">{value}</div>
        </div>

        {/* Trend Image - positioned uniformly in bottom-right */}
        <div className="absolute bottom-4 right-4 w-16 h-10 flex items-end justify-end">
          <Image
            src={trendImageSrc}
            alt={`${changeType} trend`}
            width={64}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Change Indicator - Arrow and Text */}
        <div className="flex items-center gap-1">
          {changeType === 'positive' ? (
            <TrendingUp className="w-4 h-4 text-[#2F9F02]" />
          ) : (
            <TrendingDown className="w-4 h-4 text-[#ED1C24]" />
          )}
          <span
            className={`text-xs font-semibold ${
              changeType === 'positive' ? 'text-[#2F9F02]' : 'text-[#ED1C24]'
            }`}
          >
            {change}
          </span>
          <span className="text-xs font-medium text-[#8598B3]">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

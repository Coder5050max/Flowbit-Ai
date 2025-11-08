import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const invoiceTrendsRouter = Router();

invoiceTrendsRouter.get('/', async (req, res) => {
  try {
    // Get ALL invoices from the database (not just current year)
    const invoices = await prisma.invoice.findMany({
      select: {
        issueDate: true,
        total: true,
      },
      orderBy: {
        issueDate: 'asc',
      },
    });

    // Group by month
    const monthlyData: Record<string, { count: number; value: number }> = {};

    invoices.forEach((invoice) => {
      const month = invoice.issueDate.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, value: 0 };
      }
      monthlyData[month].count += 1;
      monthlyData[month].value += invoice.total.toNumber();
    });

    // Get the last 12 months from today (including current month)
    const today = new Date();
    const trends: Array<{ month: string; invoiceCount: number; totalValue: number }> = [];
    
    // Generate last 12 months from today backwards
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      
      const existingData = monthlyData[monthKey];
      if (existingData) {
        trends.push({
          month: monthKey,
          invoiceCount: existingData.count,
          totalValue: existingData.value,
        });
      } else {
        trends.push({
          month: monthKey,
          invoiceCount: 0,
          totalValue: 0,
        });
      }
    }

    res.json(trends);
  } catch (error) {
    console.error('Error fetching invoice trends:', error);
    res.status(500).json({ error: 'Failed to fetch invoice trends' });
  }
});


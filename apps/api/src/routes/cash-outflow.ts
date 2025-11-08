import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const cashOutflowRouter = Router();

cashOutflowRouter.get('/', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all invoices (issueDate is required, dueDate is optional)
    // Include all invoices (paid or unpaid) to show expected cash outflow
    const invoices = await prisma.invoice.findMany({
      select: {
        dueDate: true,
        issueDate: true,
        total: true,
        status: true,
      },
    });

    // Group by date ranges: 0-7 days, 8-30 days, 31-60 days, 60+ days
    const ranges = {
      '0-7': 0,
      '8-30': 0,
      '31-60': 0,
      '60+': 0,
    };

    invoices.forEach((invoice) => {
      // Use dueDate if available, otherwise estimate as issueDate + 30 days
      const paymentDate = invoice.dueDate 
        ? new Date(invoice.dueDate)
        : new Date(invoice.issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      paymentDate.setHours(0, 0, 0, 0);
      
      // Calculate days from today
      const daysDiff = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      const amount = invoice.total.toNumber();
      
      // Group into ranges
      if (daysDiff >= 0 && daysDiff <= 7) {
        ranges['0-7'] += amount;
      } else if (daysDiff >= 8 && daysDiff <= 30) {
        ranges['8-30'] += amount;
      } else if (daysDiff >= 31 && daysDiff <= 60) {
        ranges['31-60'] += amount;
      } else if (daysDiff > 60) {
        ranges['60+'] += amount;
      }
      // Note: We're not including past due dates (daysDiff < 0) as they're already past
    });

    // Return as array with date ranges as labels
    const result = [
      { date: '0-7 days', amount: ranges['0-7'] },
      { date: '8-30 days', amount: ranges['8-30'] },
      { date: '31-60 days', amount: ranges['31-60'] },
      { date: '60+ days', amount: ranges['60+'] },
    ];

    res.json(result);
  } catch (error) {
    console.error('Error fetching cash outflow:', error);
    res.status(500).json({ error: 'Failed to fetch cash outflow forecast' });
  }
});


import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const statsRouter = Router();

statsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    // Current month
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    // Last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Total Spend (YTD)
    const totalSpendYTD = await prisma.invoice.aggregate({
      where: {
        issueDate: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
      _sum: {
        total: true,
      },
    });

    const totalSpendCurrentMonth = await prisma.invoice.aggregate({
      where: {
        issueDate: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _sum: {
        total: true,
      },
    });

    const totalSpendLastMonth = await prisma.invoice.aggregate({
      where: {
        issueDate: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
      _sum: {
        total: true,
      },
    });

    // Total Invoices Processed (YTD)
    const totalInvoicesYTD = await prisma.invoice.count({
      where: {
        issueDate: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
    });

    const totalInvoicesCurrentMonth = await prisma.invoice.count({
      where: {
        issueDate: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    const totalInvoicesLastMonth = await prisma.invoice.count({
      where: {
        issueDate: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    // Documents Uploaded (total invoices)
    const documentsUploaded = await prisma.invoice.count();

    const documentsUploadedThisMonth = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    const documentsUploadedLastMonth = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    // Average Invoice Value (YTD)
    const avgInvoiceValueYTD = await prisma.invoice.aggregate({
      where: {
        issueDate: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
      _avg: {
        total: true,
      },
    });

    const avgInvoiceValueCurrentMonth = await prisma.invoice.aggregate({
      where: {
        issueDate: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _avg: {
        total: true,
      },
    });

    const avgInvoiceValueLastMonth = await prisma.invoice.aggregate({
      where: {
        issueDate: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
      _avg: {
        total: true,
      },
    });

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const totalSpendChange = calculateChange(
      totalSpendCurrentMonth._sum.total?.toNumber() || 0,
      totalSpendLastMonth._sum.total?.toNumber() || 0
    );

    const totalInvoicesChange = calculateChange(
      totalInvoicesCurrentMonth,
      totalInvoicesLastMonth
    );

    const documentsChange = documentsUploadedLastMonth - documentsUploadedThisMonth;

    const avgInvoiceChange = calculateChange(
      avgInvoiceValueCurrentMonth._avg.total?.toNumber() || 0,
      avgInvoiceValueLastMonth._avg.total?.toNumber() || 0
    );

    res.json({
      totalSpend: totalSpendYTD._sum.total?.toNumber() || 0,
      totalInvoices: totalInvoicesYTD,
      documentsUploaded,
      documentsUploadedThisMonth,
      averageInvoiceValue: avgInvoiceValueYTD._avg.total?.toNumber() || 0,
      changes: {
        totalSpend: totalSpendChange,
        totalInvoices: totalInvoicesChange,
        documents: documentsChange,
        averageInvoice: avgInvoiceChange,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

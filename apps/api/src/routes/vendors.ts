import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const vendorsRouter = Router();

vendorsRouter.get('/top10', async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        invoices: {
          select: {
            total: true,
          },
        },
      },
    });

    const vendorSpend = vendors
      .map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
        totalSpend: vendor.invoices.reduce(
          (sum, inv) => sum + inv.total.toNumber(),
          0
        ),
      }))
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 10);

    res.json(vendorSpend);
  } catch (error) {
    console.error('Error fetching top vendors:', error);
    res.status(500).json({ error: 'Failed to fetch top vendors' });
  }
});


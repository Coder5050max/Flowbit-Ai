import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const categorySpendRouter = Router();

categorySpendRouter.get('/', async (req, res) => {
  try {
    const lineItems = await prisma.lineItem.findMany({
      where: {
        category: {
          not: null,
        },
      },
      select: {
        category: true,
        amount: true,
      },
    });

    const categorySpend: Record<string, number> = {};

    lineItems.forEach((item) => {
      const category = item.category || 'Uncategorized';
      categorySpend[category] = (categorySpend[category] || 0) + item.amount.toNumber();
    });

    const result = Object.entries(categorySpend)
      .map(([category, spend]) => ({
        category,
        spend,
      }))
      .sort((a, b) => b.spend - a.spend);

    res.json(result);
  } catch (error) {
    console.error('Error fetching category spend:', error);
    res.status(500).json({ error: 'Failed to fetch category spend' });
  }
});


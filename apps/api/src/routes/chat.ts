import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

export const chatRouter = Router();

chatRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const vannaApiUrl = process.env.VANNA_API_BASE_URL || 'http://localhost:8000';

    // Proxy request to Vanna AI service
    const response = await fetch(`${vannaApiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vanna API error:', errorText);
      return res.status(response.status).json({
        error: 'Failed to process query',
        details: errorText,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});


import { Router } from 'express';
import dotenv from 'dotenv';

export const chatRouter = Router();

chatRouter.post('/', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    let vannaApiUrl = process.env.VANNA_API_BASE_URL || 'http://localhost:8000';
    
    // Remove trailing slash if present
    vannaApiUrl = vannaApiUrl.replace(/\/+$/, '');
    
    console.log('Chat request received:', { query, vannaApiUrl });

    if (!vannaApiUrl || vannaApiUrl === 'http://localhost:8000') {
      console.error('VANNA_API_BASE_URL is not set or using default localhost');
      return res.status(500).json({
        error: 'Vanna service not configured',
        details: 'VANNA_API_BASE_URL environment variable is not set. Please configure it in Render.',
      });
    }

    // Proxy request to Vanna AI service
    const vannaEndpoint = `${vannaApiUrl}/query`;
    console.log(`Calling Vanna service: ${vannaEndpoint}`);
    
    const response = await fetch(vannaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    console.log(`Vanna response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vanna API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: vannaEndpoint,
      });
      
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.detail || errorJson.error || errorText;
      } catch {
        // Not JSON, use as is
      }
      
      return res.status(response.status).json({
        error: 'Failed to process query',
        details: errorDetails,
        vannaUrl: vannaApiUrl,
      });
    }

    const data = await response.json();
    console.log('Vanna response received successfully');
    res.json(data);
  } catch (error) {
    console.error('Error in chat endpoint:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a connection error
    if (errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND')) {
      return res.status(503).json({
        error: 'Cannot connect to Vanna service',
        details: `Failed to reach Vanna service at ${process.env.VANNA_API_BASE_URL}. Please check if the service is running and VANNA_API_BASE_URL is correct.`,
        vannaUrl: process.env.VANNA_API_BASE_URL,
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      details: errorMessage,
    });
  }
});


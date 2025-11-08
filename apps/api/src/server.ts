import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { statsRouter } from './routes/stats';
import { invoiceTrendsRouter } from './routes/invoice-trends';
import { vendorsRouter } from './routes/vendors';
import { categorySpendRouter } from './routes/category-spend';
import { cashOutflowRouter } from './routes/cash-outflow';
import { invoicesRouter } from './routes/invoices';
import { chatRouter } from './routes/chat';
import { seedRouter } from './routes/seed';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// CORS configuration - allow frontend URL from environment variable
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : process.env.NODE_ENV === 'production' 
    ? [] 
    : ['http://localhost:3000'];

// Log CORS configuration on startup
console.log('CORS Configuration:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('  Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    console.log(`CORS: Checking origin: ${origin}`);
    
    // In production, only allow specified origins
    if (process.env.NODE_ENV === 'production') {
      // Normalize origin (remove trailing slash)
      const normalizedOrigin = origin.replace(/\/$/, '');
      const normalizedAllowed = allowedOrigins.map(url => url.replace(/\/$/, ''));
      
      if (normalizedAllowed.includes(normalizedOrigin) || normalizedAllowed.includes(origin)) {
        console.log(`CORS: Allowing origin: ${origin}`);
        callback(null, true);
      } else {
        console.error(`CORS: BLOCKED origin: ${origin}`);
        console.error(`CORS: Allowed origins are: ${JSON.stringify(allowedOrigins)}`);
        console.error(`CORS: Please set FRONTEND_URL environment variable to: ${origin}`);
        callback(new Error(`Not allowed by CORS. Origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`));
      }
    } else {
      // In development, allow all origins
      console.log(`CORS: Development mode - allowing origin: ${origin}`);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flowbit AI API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      stats: '/api/stats',
      invoiceTrends: '/api/invoice-trends',
      vendors: '/api/vendors/top10',
      categorySpend: '/api/category-spend',
      cashOutflow: '/api/cash-outflow',
      invoices: '/api/invoices',
      chatWithData: '/api/chat-with-data'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/stats', statsRouter);
app.use('/api/invoice-trends', invoiceTrendsRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/category-spend', categorySpendRouter);
app.use('/api/cash-outflow', cashOutflowRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/chat-with-data', chatRouter);
app.use('/api/seed', seedRouter);

// Listen on all interfaces (0.0.0.0) for Render deployment
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});


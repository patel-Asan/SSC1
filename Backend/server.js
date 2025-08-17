import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userroutes.js';
import productRouter from './routes/productroute.js';
import cartRouter from './routes/cartroute.js';
import orderRouter from './routes/orderroutes.js';
import adminRouter from './routes/adminroutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/admin', adminRouter);

// Default root route
app.get('/', (req, res) => res.json({
  message: 'E-commerce API is running',
  version: '1.0.0',
  endpoints: {
    health: '/health',
    users: '/api/user',
    products: '/api/product',
    cart: '/api/cart',
    order: '/api/order',
    admin: '/api/admin',
  }
}));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// Start the server

const startServer = async () => {
  console.log('🚀 Starting E-commerce Backend Server...');
  await connectDB();
};

startServer();

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
}




export default app;
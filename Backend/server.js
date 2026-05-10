import express from 'express';
import cors from 'cors';
import compression from 'compression';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userroutes.js';
import productRouter from './routes/productroute.js';
import cartRouter from './routes/cartroute.js';
import orderRouter from './routes/orderroutes.js';
import adminRouter from './routes/adminroutes.js';
import reviewRouter from './routes/reviewroutes.js';
import statsRouter from './routes/statsroute.js';
import notificationRouter from './routes/notificationroutes.js';
import analyticsRouter from './routes/analyticsroutes.js';
import customerRouter from './routes/customerroutes.js';
import couponRouter from './routes/couponroutes.js';
import inventoryRouter from './routes/inventoryroutes.js';
import exportRouter from './routes/exportroutes.js';
import categoryRouter from './routes/categoryroutes.js';
import emailRouter from './routes/emailroutes.js';
import messageRouter from './routes/messageroutes.js';
import wishlistRouter from './routes/wishlistroutes.js';
import passwordRouter from './routes/passwordroutes.js';
import subscribeRouter from './routes/subscriberroutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(compression());
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'token', 'Authorization'],
  credentials: true
}));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running', time: new Date().toISOString() });
});

// API Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/admin', adminRouter);
app.use('/api/review', reviewRouter);
app.use('/api/stats', statsRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/customer', customerRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/export', exportRouter);
app.use('/api/category', categoryRouter);
app.use('/api/email', emailRouter);
app.use('/api/message', messageRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/password', passwordRouter);
app.use('/api/subscribe', subscribeRouter);

// Root info
app.get('/', (req, res) => res.json({ message: 'E-commerce API running', port }));

// 404
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start server after DB connects
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB Connected!');

    console.log('Configuring Cloudinary...');
    await connectCloudinary();
    console.log('Cloudinary Connected!');

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1); // stop server if DB fails
  }
};

startServer();

export default app;

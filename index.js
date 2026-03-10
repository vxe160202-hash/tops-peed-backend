import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/auth.js';

// استيراد الـ Routes الخاصة بك كما هي
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import modificationRoutes from './routes/modificationRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import configuratorRoutes from './routes/configuratorRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

dotenv.config();

const app = express();

// Global database connection status
let dbConnected = false;

// إعدادات الـ Middleware الأساسية
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: true, 
  credentials: true,
}));

// 1. مسارات الفحص السريع (Health Checks) 
// وضعناها هنا لضمان الرد الفوري وتجنب خطأ 504
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running', db: dbConnected ? 'connected' : 'connecting' });
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'Success', message: 'Top Speed API is Live!' });
});

// 2. Middleware الاتصال بقاعدة البيانات
// يتم استدعاؤه فقط عند محاولة الوصول للمسارات الفعلية
app.use(async (req, res, next) => {
  // Skip database check for health endpoints
  if (req.path === '/' || req.path === '/api/health') {
    return next();
  }
  
  try {
    // Only connect if not already connected
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
      console.log('✅ Database connected on first request');
    }
    next();
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    // Still proceed but log the error - don't block requests
    next();
  }
});

// 3. تعريف المسارات (Routes)
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/modifications', modificationRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/configurator', configuratorRoutes);
app.use('/api/service', serviceRoutes);

// معالج الأخطاء
app.use(errorHandler);

// تصدير التطبيق لفيرسل
export default app;

// إذا تم تشغيل الملف مباشرةً، استمع على المنفذ المحدد
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.BACKEND_PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 API server listening on port ${PORT}`);
  });
}
import express from 'express';
import {
  trackVisitor,
  getVisitorStats,
  getAllVisitors,
  deleteOldVisitors,
} from '../controllers/visitorController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public route - track visitor (no authentication required)
router.post('/track', trackVisitor);

// Admin routes - require authentication
router.get('/admin/stats', authMiddleware, getVisitorStats);
router.get('/admin/all', authMiddleware, getAllVisitors);
router.delete('/admin/cleanup', authMiddleware, deleteOldVisitors);

export default router;

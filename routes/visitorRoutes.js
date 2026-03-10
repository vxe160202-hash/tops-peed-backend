import express from 'express';
import {
  trackVisitor,
  getVisitorStats,
  getAllVisitors,
  deleteOldVisitors,
} from '../controllers/visitorController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route - track visitor (no authentication required)
router.post('/track', trackVisitor);

// Admin routes - require authentication
router.get('/admin/stats', authenticateToken, getVisitorStats);
router.get('/admin/all', authenticateToken, getAllVisitors);
router.delete('/admin/cleanup', authenticateToken, deleteOldVisitors);

export default router;

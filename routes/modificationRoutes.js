import express from 'express';
import {
  getModifications,
  createModification,
  updateModification,
  deleteModification,
} from '../controllers/modificationController.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getModifications);
router.post('/', adminMiddleware, createModification);
router.put('/:id', adminMiddleware, updateModification);
router.delete('/:id', adminMiddleware, deleteModification);

export default router;

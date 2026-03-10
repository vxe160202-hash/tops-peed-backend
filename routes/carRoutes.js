import express from 'express';
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  importFromAPI,
} from '../controllers/carController.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/', adminMiddleware, createCar);
router.put('/:id', adminMiddleware, updateCar);
router.delete('/:id', adminMiddleware, deleteCar);
router.post('/admin/import', adminMiddleware, importFromAPI);

export default router;

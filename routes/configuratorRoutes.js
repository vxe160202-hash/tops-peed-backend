import express from 'express';
import { calculateConfiguration } from '../controllers/configuratorController.js';

const router = express.Router();

router.post('/calculate', calculateConfiguration);

export default router;

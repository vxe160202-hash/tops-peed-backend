import express from 'express';
import { sendModificationRequest, sendMaintenanceRequest } from '../controllers/serviceController.js';

const router = express.Router();

// Route to send modification request
router.post('/send-modification-request', sendModificationRequest);

// Route to send maintenance request
router.post('/send-maintenance-request', sendMaintenanceRequest);

export default router;

import express from 'express';
import { login, register, verifyOTP, resendOTP, createAdmin, updateEmail, forgotPassword, resetPassword, verifyResetToken } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/create-admin', createAdmin);
router.post('/update-email', authMiddleware, updateEmail);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-token', verifyResetToken);

export default router;

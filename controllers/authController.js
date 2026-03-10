import { User } from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import { sendOTPEmail, sendPasswordResetEmail } from '../services/emailService.js';
import crypto from 'crypto';

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'User account is disabled' });
    }

    const token = generateToken(user._id, user.role, user.email);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Check if email is admin email
    const ADMIN_EMAIL = 'belalmohamedyousry@gmail.com';
    const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    user = new User({
      name,
      email,
      password,
      role: isAdminEmail ? 'admin' : 'user',
      otp,
      otpExpiresAt,
      isActive: false,
      isEmailVerified: false,
    });

    await user.save();

    // Send OTP to email
    try {
      await sendOTPEmail(email, name, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Delete user if email fails
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }

    res.status(201).json({
      message: 'Account created. Please check your email for the verification code.',
      email: email,
      requiresOTP: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if OTP is expired
    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(401).json({ error: 'OTP has expired. Please sign up again.' });
    }

    // Check if OTP is correct
    if (user.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP. Please try again.' });
    }

    // Mark as verified and activate
    user.isEmailVerified = true;
    user.isActive = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate token for immediate login
    const token = generateToken(user._id, user.role, user.email);

    res.json({
      message: 'Email verified successfully. Welcome to TOP SPEED!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    try {
      await sendOTPEmail(email, user.name, otp);
    } catch (emailError) {
      console.error('Failed to resend OTP email:', emailError);
      return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }

    res.json({
      message: 'New OTP sent to your email',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
    });

    await user.save();
    const token = generateToken(user._id, user.role, user.email);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    const userId = req.user.userId;

    if (!newEmail || !password) {
      return res.status(400).json({ error: 'New email and password are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password before allowing email change
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Check if new email is already taken
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Update email
    user.email = newEmail;
    await user.save();

    // Generate new token with updated email
    const token = generateToken(user._id, user.role, user.email);

    res.json({
      message: 'Email updated successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // For security, don't reveal if email exists
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email with token
    try {
      await sendPasswordResetEmail(email, user.name, resetToken);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      return res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
    }

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Token, password, and confirmation are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successfully. Please login with your new password.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ valid: false, error: 'Token is required' });
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.json({ valid: false, error: 'Invalid or expired token' });
    }

    res.json({ valid: true, email: user.email });
  } catch (error) {
    res.status(500).json({ valid: false, error: error.message });
  }
};

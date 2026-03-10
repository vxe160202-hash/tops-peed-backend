import { verifyToken } from '../utils/auth.js';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

export const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    const ADMIN_EMAIL = 'belalmohamedyousry@gmail.com';
    const isAdminByRole = req.user.role === 'admin';
    const isAdminByEmail = req.user.email && req.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    if (!isAdminByRole && !isAdminByEmail) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};

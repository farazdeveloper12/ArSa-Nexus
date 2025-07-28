// lib/middleware/auth.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../pages/api/auth/[...nextauth]';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get session from NextAuth using the correct method
    const session = await getServerSession(req, res, authOptions);

    if (session && session.user) {
      req.user = session.user;
      return next();
    }

    // If no session, return unauthorized
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please login'
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};
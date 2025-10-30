import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/OceanCanvas/UserSchema';

// Extend Request interface to include user data
interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    admin: boolean;
  };
}

const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: 'Access denied. No token provided.',
      });
    }

    // Check if token follows Bearer format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: 'Access denied. Invalid token format.',
      });
    }

    // Extract token from Bearer format
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: 'Access denied. No token provided.',
      });
    }

    // Verify JWT secret exists
    const jwtKey = process.env.JWT_SECRET;
    if (!jwtKey) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({
        status: 500,
        success: false,
        error: 'Server configuration error.',
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, jwtKey) as {
      _id: string;
      name: string;
      email: string;
      admin: boolean;
      iat?: number;
      exp?: number;
    };

    // Validate decoded token structure
    if (!decoded._id) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: 'Invalid token. Missing user ID.',
      });
    }

    // Optional: Verify user still exists in database
    try {
      const user = await User.findById(decoded._id).select('_id name email admin');

      if (!user) {
        return res.status(401).json({
          status: 401,
          success: false,
          error: 'User not found. Token may be invalid.',
        });
      }

      // Attach user data to request
      req.userId = decoded._id;
      req.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        admin: user.admin,
      };

      console.log(`Token verified for user: ${user.email} (${user._id})`);
    } catch (dbError) {
      console.error('Database error during token verification:', dbError);
      return res.status(500).json({
        status: 500,
        success: false,
        error: 'Server error during authentication.',
      });
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error);

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: 'Invalid token.',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: 'Token has expired.',
      });
    }

    if (error instanceof jwt.NotBeforeError) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: 'Token not active.',
      });
    }

    // Generic error response
    return res.status(401).json({
      status: 401,
      success: false,
      error: 'Authentication failed.',
    });
  }
};

export default verifyToken;

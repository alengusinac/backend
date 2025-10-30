import jwt from 'jsonwebtoken';
import { User } from '../models/OceanCanvas/UserSchema';

const verifyAdmin = async (req: any, res: any, next: any) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      status: 401,
      success: false,
      error: 'Access denied. No token provided.',
    });
  }

  try {
    const jwtKey = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, jwtKey) as {
      _id: string;
      name: string;
      email: string;
      admin: boolean;
      address: any;
    };

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: 'User not found.',
      });
    }

    if (!user.admin) {
      return res.status(403).json({
        status: 403,
        success: false,
        error: 'Access denied. Admin privileges required.',
      });
    }

    req.userId = decoded._id;
    req.user = {
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
      admin: decoded.admin,
    };

    next();
  } catch (error) {
    console.log('VerifyAdmin Error:', error);
    res.status(401).json({
      status: 401,
      success: false,
      error: 'Invalid token.',
    });
  }
};

export default verifyAdmin;

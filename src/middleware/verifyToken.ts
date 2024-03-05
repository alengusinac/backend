import { log } from 'console';
import jwt from 'jsonwebtoken';

const verifyToken = (req: any, res: any, next: any) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const jwtKey = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, jwtKey) as { _id: string };
    req.userId = decoded._id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifyToken;

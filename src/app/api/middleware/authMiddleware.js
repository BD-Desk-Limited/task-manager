import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token and assign user to req
export async function verifyToken(req) {
    
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Token missing or invalid');
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, SECRET);
      req.user = decoded;
      console.log('Headers:', decoded);
      return;
    } catch (error) {
      throw new Error('Unauthorized: Invalid token');
    }
};
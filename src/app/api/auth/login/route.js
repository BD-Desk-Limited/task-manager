import User from '@/models/User';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET;
  
  // Handle POST requests for user login
  export async function POST(req) {
    try {
      await connectDB();
      
      const body = await req.json();
      console.log('BODY:', body);
      const user = await User.findOne({ email: body.email });
      console.log('user found:', user);
      if (!user || user.password !== body.password) {
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid credentials' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });
      return new Response(
        JSON.stringify({ success: true, data: { user, token } }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
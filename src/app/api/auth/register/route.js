import User from '@/models/User';
import connectDB from '@/lib/db';
import { verifyToken } from '../../middleware/authMiddleware';

// Handle POST requests for user registration
export async function POST(req) {
    try {
      await connectDB();
      await verifyToken(req);

      const body = await req.json();
      const existingUser = await User.findOne({ email: body.email });
      if (existingUser) {
        return new Response(
          JSON.stringify({ success: false, message: 'User already exists' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const newUser = new User(body);
      await newUser.save();
      return new Response(
        JSON.stringify({ success: true, data: { user: newUser } }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
import connectDB from '@/lib/db';

export async function GET(req) {
  try {
    await connectDB();
    return new Response(
      JSON.stringify({ success: true, message: 'Database connected successfully!' }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Database connection failed!', error: error.message }),
      { status: 500 }
    );
  }
}

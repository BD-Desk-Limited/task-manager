import connectDB from '@/lib/db';
import Scrum from '@/models/Scrum';
import { verifyToken } from '@/app/api/middleware/authMiddleware';

// Handle POST requests to add a task to a scrum
export async function POST(req) {
    try {
      await connectDB();
      await verifyToken(req);
  
      const { searchParams } = new URL(req.url);
      const scrumId = searchParams.get('id');
      if (!scrumId) {
        return new Response(
          JSON.stringify({ success: false, message: 'Scrum ID is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const body = await req.json();
      if (!body.taskId) {
        return new Response(
          JSON.stringify({ success: false, message: 'Task ID is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const scrum = await Scrum.findById(scrumId);
      if (!scrum) {
        return new Response(
          JSON.stringify({ success: false, message: 'Scrum not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      scrum.tasks.push(body.taskId);
      await scrum.save();
  
      return new Response(
        JSON.stringify({ success: true, data: scrum }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
}
  
  // Handle PUT requests to remove a task from a scrum
export async function PUT(req) {
  try {
    await connectDB();
    await verifyToken(req);

    const { searchParams } = new URL(req.url);
    const scrumId = searchParams.get('id');
    if (!scrumId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Scrum ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    if (!body.taskId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Task ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const scrum = await Scrum.findById(scrumId);
    if (!scrum) {
      return new Response(
        JSON.stringify({ success: false, message: 'Scrum not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    scrum.tasks = scrum.tasks.filter(taskId => taskId.toString() !== body.taskId);
    await scrum.save();

    return new Response(
      JSON.stringify({ success: true, data: scrum }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
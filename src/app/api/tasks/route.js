import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { verifyToken } from '../middleware/authMiddleware';

// Handle GET requests to fetch all tasks
export async function GET(req) {
  try {
    await connectDB();
    await verifyToken(req);

    const tasks = await Task.find({});
    return new Response(
      JSON.stringify({ success: true, data: tasks }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.get('authorization') } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle POST requests to create a new task
export async function POST(req) {
  try {
    await connectDB();
    await verifyToken(req);

    const body = await req.json();
    const newTask = new Task({ ...body, createdBy: req.user.id });
    await newTask.save();
    return new Response(
      JSON.stringify({ success: true, data: newTask }),
      { status: 201, headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.get('authorization') } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle DELETE requests to remove a task
export async function DELETE(req) {
  try {
    await connectDB();
    await verifyToken(req);

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Task ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await Task.findByIdAndDelete(taskId);
    return new Response(
      JSON.stringify({ success: true, message: 'Task deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.get('authorization') } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


import connectDB from '@/lib/db';
import Scrum from '@/models/Scrum';
import { verifyToken } from '../middleware/authMiddleware';

// Handle GET requests to fetch scrums for a specific project
export async function GET(req) {
  
  try {
    await connectDB();
    await verifyToken(req);

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Project ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const scrums = await Scrum.find({ project: projectId });
    return new Response(
      JSON.stringify({ success: true, data: scrums }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.get('authorization') } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle POST requests to create a new scrum or update existing scrum
export async function POST(req) {
  console.log('Body:', req.body)
  try {
    await connectDB();
    await verifyToken(req);

    const body = await req.json();
    const { id, ...scrumData } = body;

    let scrum;

    if (id) {
      // Update existing scrum
      scrum = await Scrum.findById(id);
      if (!scrum) {
        return new Response(
          JSON.stringify({ success: false, message: 'Scrum not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      Object.assign(scrum, scrumData);
      await scrum.save();
    } else {
      // Create new scrum
      scrum = new Scrum({
        ...scrumData,
        createdBy: req.user.id,
      });
      await scrum.save();
    }

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

// Handle DELETE requests to delete a scrum
export async function DELETE(req) {
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

    const scrum = await Scrum.findById(scrumId);
    if (!scrum) {
      return new Response(
        JSON.stringify({ success: false, message: 'Scrum not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (scrum.createdBy.toString() !== req.user.id) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized: You are not the creator of this scrum' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await Scrum.findByIdAndDelete(scrumId);

    return new Response(
      JSON.stringify({ success: true, message: 'Scrum deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

import Project from '@/models/project';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { verifyToken } from '@/app/api/middleware/authMiddleware';

export async function GET(req) {
  try {
    await connectDB();

    // Verify token and get the user
    await verifyToken(req);

    // Fetch projects where the user is a member
    const projects = await Project.find({ users: req.user.id });

    return new Response(
      JSON.stringify({ success: true, data: projects }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

//post request to create project
export async function POST(req) {
  try {
    await connectDB();

    // Verify token and get the user
    await verifyToken(req);

    // Parse request body
    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return new Response(
        JSON.stringify({ success: false, message: 'Project name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the new project
    const newProject = new Project({
      name: body.name,
      description: body.description || '',
      users: [req.user.id], // Add the authenticated user as the first member
      workflowStatuses: body.workflowStatuses || ['to-do', 'ongoing', 'complete', 'ready for supervision'],
    });

    await newProject.save();

    return new Response(
      JSON.stringify({ success: true, data: newProject }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

//put method to edit project
export async function PUT(req) {
  try {
    await connectDB();

    // Verify token and get the user
    await verifyToken(req);

    // Parse the request body and query params
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Project ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();

    // Fetch the project and check if the user is authorized
    const project = await Project.findById(projectId);
    if (!project) {
      return new Response(
        JSON.stringify({ success: false, message: 'Project not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!project.users.includes(req.user.id)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized: You are not a member of this project' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update project fields
    if (body.name) project.name = body.name;
    if (body.description) project.description = body.description;
    if (body.workflowStatuses) project.workflowStatuses = body.workflowStatuses;
    if (body.users) project.users = body.users;

    await project.save();

    return new Response(
      JSON.stringify({ success: true, data: project }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}



import Project from '@/models/project';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { verifyToken } from '@/app/api/middleware/authMiddleware';

//Patch function to add user
export async function PATCH(req) {
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
  
      if (!body.email) {
        return new Response(
          JSON.stringify({ success: false, message: 'Email is required to add a user to the project' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Fetch the project and check if the requester is authorized
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
  
      // Check if the user exists by email
      const userToAdd = await User.findOne({ email: body.email });
      if (!userToAdd) {
        return new Response(
          JSON.stringify({ success: false, message: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Check if the user is already in the project
      if (project.users.includes(userToAdd._id)) {
        return new Response(
          JSON.stringify({ success: false, message: 'User is already a member of this project' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Add the user to the project
      project.users.push(userToAdd._id);
      await project.save();
  
      return new Response(
        JSON.stringify({ success: true, message: 'User added to the project', newUser: userToAdd._id, data: project }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
}
  
//delete function to remove user
export async function DELETE(req) {
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
  
      if (!body.email) {
        return new Response(
          JSON.stringify({ success: false, message: 'Email is required to remove a user from the project' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Fetch the project and check if the requester is authorized
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
  
      // Check if the user exists by email
      const userToRemove = await User.findOne({ email: body.email });
      if (!userToRemove) {
        return new Response(
          JSON.stringify({ success: false, message: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Check if the user is part of the project
      if (!project.users.includes(userToRemove._id)) {
        return new Response(
          JSON.stringify({ success: false, message: 'User is not a member of this project' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Remove the user from the project
      project.users = project.users.filter((userId) => userId.toString() !== userToRemove._id.toString());
      await project.save();
  
      return new Response(
        JSON.stringify({ success: true, message: 'User removed from the project', data: project }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
}
  
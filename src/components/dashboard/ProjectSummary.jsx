"use client";
import React, { useEffect, useState } from "react";
import { useProject } from "../../../contexts/ProjectContext";

const ProjectSummary = () => {
  const { selectedProject, setSelectedProject } = useProject();

  const [newStage, setNewStage] = useState("");
  const [workflowStatuses, setWorkflowStatuses] = useState([]);
  const [showTeam, setShowTeam] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [teamMemberDetails, setTeamMemberDetails] = useState([])
  const [isSaving, setIsSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState("");
  const [editableDescription, setEditableDescription] = useState("");

  useEffect(() => {
    setWorkflowStatuses(selectedProject?.workflowStatuses || []);
    setTeamMembers(selectedProject?.users || []);
    setEditableName(selectedProject?.name || "");
    setEditableDescription(selectedProject?.description || "");
  }, [selectedProject]);

  // Add a new workflow stage
  const addWorkflowStage = () => {
    if (newStage.trim()) {
      setWorkflowStatuses([...workflowStatuses, newStage.trim()]);
      setNewStage("");
    }
  };

  // Remove a workflow stage
  const removeWorkflowStage = (index) => {
    setWorkflowStatuses(workflowStatuses.filter((_, i) => i !== index));
  };

  // Add a new team member
  const addTeamMember = async () => {
    if (!newMemberEmail.trim()) {
      alert("Please enter a valid email.");
      return;
    }
  
    try {
      const response = await fetch(`/api/project/users?id=${selectedProject._id}`, {
        method: "PATCH", // Use PATCH for adding resources
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email: newMemberEmail.trim() }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add team member");
      }
  
      const data = await response.json();
      const newUserId = data?.newUser; // Assume the backend returns the added user's ID
      console.log('New User:', newUserId);
      // Update team members in state
      setTeamMembers((prev) => [...prev, newUserId]);
      setSelectedProject((prev) => ({
        ...prev,
        users: [...prev.users, newUserId],
      }));
  
      alert("User added successfully!");
      setNewMemberEmail(""); // Clear input field
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  

  const removeTeamMember = async (email) => {
  
    try {
      const response = await fetch(`/api/project/users?id=${selectedProject._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove team member");
      }

      // Optimistic update
    const updatedTeam = teamMemberDetails.filter(
        member => member.email !== email
    )

    setTeamMemberDetails(updatedTeam);
  
      setSelectedProject((prev) => ({
        ...prev,
        users : updatedTeam.map(user => (user._id))
      }));
  
      alert("User removed successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Save workflow to backend
  const saveWorkflow = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/project?id=${selectedProject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ workflowStatuses }),
      });

      if (!response.ok) {
        throw new Error("Failed to save workflow");
      }

      setSelectedProject((prev) => ({
        ...prev,
        workflowStatuses,
      }));
      alert("Workflow updated successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save project details to backend
  const saveProjectDetails = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/project?id=${selectedProject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: editableName,
          description: editableDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save project details");
      }

      setSelectedProject((prev) => ({
        ...prev,
        name: editableName,
        description: editableDescription,
      }));
      alert("Project details updated successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  // Fetch user details for team members
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const fetchedDetails = await Promise.all(
          teamMembers.map(async (userId) => {
            const response = await fetch(`/api/user?id=${userId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            if (!response.ok) {
              throw new Error("Failed to fetch user");
            }

            const user = await response.json();
            return user.data;
          })
        );
        setTeamMemberDetails(fetchedDetails);
      } catch (error) {
        console.error("Error fetching team member details:", error.message);
      }
    };

    if (teamMembers.length) {
      fetchTeamDetails();
    }
  }, [teamMembers]);
  

  return (
    <div className="flex gap-6">
      {/* Left Side: Project Details */}
      <div className="w-1/3 bg-gray-100 p-4 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
          ) : (
            selectedProject?.name
          )}
        </h3>
        <p className="text-gray-700 mb-4">
          {isEditing ? (
            <textarea
              value={editableDescription}
              onChange={(e) => setEditableDescription(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
          ) : (
            selectedProject?.description || "No description available."
          )}
        </p>
        <button
          onClick={isEditing ? saveProjectDetails : () => setIsEditing(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          disabled={isSaving}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Right Side: Functionalities */}
      <div className="w-2/3 bg-white p-4 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Project Workflow</h3>
        <div className="mb-6">
        <ul className="flex items-center gap-4">
            {workflowStatuses?.map((status, index) => (
              <React.Fragment key={index}>
                <li className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded shadow text-xs">
                  <span>{status}</span>
                  <button
                    onClick={() => removeWorkflowStage(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </li>
                {index < workflowStatuses.length - 1 && (
                  <span className="text-gray-400">→</span>
                )}
              </React.Fragment>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              placeholder="Add new stage"
              className="border px-4 py-2 rounded w-full"
            />
            <button
              onClick={addWorkflowStage}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Stage
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={saveWorkflow}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Workflow"}
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Team Members</h3>
        <div className="relative">
          <button
            onClick={() => setShowTeam((prev) => !prev)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 relative"
          >
            {showTeam ? "Hide Team" : "Show Team"}
            {!showTeam && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {teamMembers?.length}
              </span>
            )}
          </button>
          {showTeam && (
            <div className="mt-4 border rounded shadow-md p-4">
              <ul className="space-y-2">
                {teamMemberDetails?.map((member, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
                  >
                    <span>{member.name} ({member.email})</span>
                    <button
                      onClick={() => removeTeamMember(member.email)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Add member by email"
                  className="border px-4 py-2 rounded w-full"
                />
                <button
                  onClick={addTeamMember}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;

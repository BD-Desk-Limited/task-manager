import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "../../../contexts/ProjectContext";

const SideBar = () => {
  const { setSelectedProject } = useProject();
  const Router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Toggles the sidebar open/close
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // List of sidebar items
  const sidebarItems = [
    {
      name: "All Projects",
      style: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        setSelectedProject(null);
        Router.push("/pages/all-projects");
      },
    },
    {
      name: "Create New Project",
      style: "bg-green-500 hover:bg-green-600",
      action: () => alert("Create New Project"),
    },
    {
      name: "Project Settings",
      style: "bg-yellow-500 hover:bg-yellow-600",
      action: () => alert("Project Settings"),
    },
    {
      name: "Team Management",
      style: "bg-purple-500 hover:bg-purple-600",
      action: () => alert("Team Management"),
    },
    {
      name: "Logout",
      style: "bg-red-500 hover:bg-red-600",
      action: () => {
        localStorage.removeItem("token"); // Remove token from local storage
        Router.push("/pages/login"); // Redirect to login page
      },
    },
  ];

  return (
    <div className="relative">
      {/* Toggle Arrow */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 bg-brand_green text-white p-2 rounded-full shadow-md focus:outline-none hover:bg-gray-400 transition"
      >
        {isOpen ? "←" : "→"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-100 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 w-64 p-6`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 bg-gray-300 p-2 rounded-full shadow-md focus:outline-none hover:bg-gray-400 transition"
        >
          {isOpen ? "←" : "→"}
        </button>
        <ul className="space-y-4 mt-10">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.action}
                className={`w-full text-left text-white py-2 px-4 rounded transition ${item.style}`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;

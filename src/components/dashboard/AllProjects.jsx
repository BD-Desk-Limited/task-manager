"use client";
import { useState, useEffect } from 'react';
import { useProject } from '../../../contexts/ProjectContext';
import { useRouter } from 'next/navigation';

export default function Allprojects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const {setSelectedProject} = useProject();
  const Router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/project', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProjects(data.data);
        } else {
          setError(data.message || 'Failed to fetch projects.');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    Router.push('/pages/dashboard');
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">My Projects</h1>
        <>
          {loading ? (
            <p className="text-center text-gray-600">Loading projects...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => handleSelectProject(project)}
                    className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
                  >
                    <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                    <p className="text-gray-700">{project.description || 'No description provided.'}</p>
                    <p className="text-sm text-gray-500 mt-5">Workflow Statuses:</p>
                    <ul className="list-none list-inside text-gray-600 flex flex-col font-semibold gap-3">
                      {project.workflowStatuses.map((status, index) => (
                        <li key={index} className="flex flex-row items-center gap-1">
                          <span className="w-3 h-3 bg-brand_blue rounded-full"></span>
                          {status}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-3">No projects found.</p>
              )}
            </div>
          )}
        </>
    </div>
  );
}

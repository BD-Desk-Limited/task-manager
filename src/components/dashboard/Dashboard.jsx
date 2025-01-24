import { useEffect, useState } from "react";
import { useProject } from "../../../contexts/ProjectContext";
import { useRouter } from "next/navigation";
import ProjectSummary from "./ProjectSummary";
import TaskBoard from "./TaskBoard";
import Backlog from "./Backklog";

export default function Dashboard() {
  const { selectedProject, setSelectedProject } = useProject();
  const [selectedTab, setSelectedTab] = useState('Board')
  const Router = useRouter();

  // Redirect to `/pages/all-projects` if no project is selected
  useEffect(() => {
    if (!selectedProject) {
      Router.push("/pages/all-projects");
    }
  }, [selectedProject, Router]);

  if (!selectedProject) {
    // Return null while redirecting
    return null;
  }

  const navBarItems = ['Project-summary', 'Board', 'Backlog', ]

  return (
    <div className="bg-white bg-opacity-90 mt-5 p-6 rounded shadow-md mx-10">
      <h2 className="text-2xl font-bold mb-4 border">Project: {selectedProject?.name}</h2>
      <nav className="flex flex-row gap-10 font-bold border border-b-3 border-b-gray-500 text-gray-700">
        {navBarItems.map((item, index)=>(
          <li 
            key={index} 
            onClick={()=>setSelectedTab(item)}
            className={`${selectedTab===item && `px-2 border border-b-2 border-b-brand_green`} list-none hover:text-brand_green cursor-pointer italic`}>
            {item}
          </li>
        ))}
      </nav>
      {selectedTab== 'Project-summary'&& (<ProjectSummary selectedProject={selectedProject}/>)}

      {selectedTab === 'Board' && (<TaskBoard project = {selectedProject}/>)}

      {selectedTab === 'Backlog' && (<Backlog project={selectedProject} setProject={setSelectedProject}/>)}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utilities/fetchData';
import FocusedScrum from './FocusedScrum';

export default function Backlog({ project, setProject }) {
  const [scrums, setScrums] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ stage: '', scrum: '', name: '', description: '', assignee: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [focusedItem, setFocusedItem] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const scrumresp = await fetchData(`/api/scrums?projectId=${project._id}`, 'GET', setScrums, setError, setLoading);
      console.log('Scrum Response:', scrumresp);
      await fetchData(`/api/tasks?projectId=${project._id}`, 'GET', setTasks, setError, setLoading);
    }
    fetch();
  }, [project]);

  const filteredTasks = tasks.filter(task => {
    return (
      (filter.stage ? task.stage === filter.stage : true) &&
      (filter.scrum ? task.scrum === filter.scrum : true) &&
      (filter.name ? task.name.includes(filter.name) : true) &&
      (filter.description ? task.description.includes(filter.description) : true) &&
      (filter.assignee ? task.assignee === filter.assignee : true)
    );
  });

  const handleScrumAdd = async () => {
    const userId = localStorage.getItem('userId');
    const newScrum = { name: 'Untitled scrum', description: 'Scrum Description...', stage: 'to-do', createdBy: userId, project: project._id };
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setScrums([...scrums, { ...newScrum, _id: tempId }]);
    setFocusedItem(newScrum);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>
    <p>{error}</p>
    <button onClick={() => setProject(null)}>Back</button>
  </div>;

  return (
    <div>
      <h1 className='text-xl my-3 font-bold'>Backlog</h1>
      <div>
        <div className='flex gap-5 mb-5'>
          <input type="text" placeholder="Filter by stage" className="text-center border border-brand_green rounded-lg" onChange={(e) => setFilter({ ...filter, stage: e.target.value })} />
          <input type="text" placeholder="Filter by scrum" className="text-center border border-brand_green rounded-lg" onChange={(e) => setFilter({ ...filter, scrum: e.target.value })} />
          <input type="text" placeholder="Filter by task name" className="text-center border border-brand_green rounded-lg" onChange={(e) => setFilter({ ...filter, name: e.target.value })} />
          <input type="text" placeholder="Filter by task description" className="text-center border border-brand_green rounded-lg" onChange={(e) => setFilter({ ...filter, description: e.target.value })} />
          <input type="text" placeholder="Filter by assignee" className="text-center border border-brand_green rounded-lg" onChange={(e) => setFilter({ ...filter, assignee: e.target.value })} />
        </div>
        <h2 className='text-brand_green font-bold'>SCRUMS</h2>
        <div className='flex flex-row'>
        <div className='w-full flex justify-center flex-col gap-1'>
          {scrums?.length > 0 ?
            scrums.map(scrum => (
              <div
                key={scrum._id}
                className={`ml-2 flex mx-2 ${focusedItem ? "w-[25vw]" : "w-full"} `}
                onClick={() => setFocusedItem(scrum)}
              >
                <div className={`flex flex-row w-full bg-white hover:text-white py-1 my-1 justify-between px-5 rounded-md cursor-pointer hover:bg-brand_green`}> 
                  <h3 className='font-semibold text-[12px] p-1 my-1/2'>{scrum.name}</h3>
                  <p className='border border-brand_green rounded-lg  p-0.5 cursor-pointer bg-brand_blue text-white'>{scrum?.stage}</p> 
                </div>
              </div>
            ))
            : <p className='w-full my-10 text-red-500 font-bold text-center'>No scrums found yet!!!</p>
          }
          <button
            onClick={() => handleScrumAdd()}
            className={`${focusedItem ? "hidden" : "block"} border border-brand_green text-brand_green py-1 mx-10 rounded-md w-auto hover:bg-brand_green hover:text-white font-bold`}
          >
            + Add Scrum
          </button>
        </div>
        {focusedItem && (
          <div className='min-w-[60vw] min-h-[60vh] rounded-md p-2'>
            <FocusedScrum
              focusedItem={focusedItem}
              setScrums={setScrums}
              project={project}
              setFocusedItem={setFocusedItem}
              setError={setError}
              setLoading={setLoading}
              scrums={scrums}
            />
          </div>
        )}
      </div>
      </div>
      <div>
        <h2>Add Task</h2>
        <button onClick={() => handleTaskAdd({ name: 'New Task', description: 'Task Description', stage: 'to-do', scrum: 'ScrumId', assignee: 'UserId' })}>Add Task</button>
      </div>
    </div>
  );
}
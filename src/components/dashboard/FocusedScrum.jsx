import { fetchData } from '@/utilities/fetchData';
import { isValidObjectId } from 'mongoose';
import {useState} from 'react';

const FocusedScrum = ({focusedItem, setFocusedItem, project, setScrums, setError, setLoading, scrums}) => {
    const [openStatuses, setOpenStatuses] = useState(false);
    const [task, setTask] = useState({});

    const handleTaskAdd = () => {
        const newTask = {
            name: 'New Task - Click to enter title', 
            description: 'Task Description...', 
            stage: focusedItem.stage, 
            scrum: focusedItem._id, 
            createdBy: user._id, 
            projectId: project._id
        };
        setFocusedItem(newTask);
        setTask(newTask);
    }

    const handleSaveScrum = async () => {
        let body = { ...focusedItem };
    
        // Check if the _id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(focusedItem._id)) {
          delete body._id; // Remove the temporary _id
        } else {
          body.id = focusedItem._id; // Use the existing _id for updating
        }
    
        const response = await fetchData('/api/scrums', 'POST', "_", setError, setLoading, body);
        setFocusedItem(null);
        setScrums([...scrums, response]);
        setFocusedItem(null);
    };

    const handleSaveTask = async (scrum) => {

        await fetchData(`/api/scrums/tasks?scrumId=${scrum._id}`, 'POST', null, setError, setLoading, task);
        setFocusedItem(null);
        setScrums(prev => ({...prev, tasks: [...prev.tasks, task]}));
    }

    const handleUpdateStage = (status) => {
        setFocusedItem({...focusedItem, stage: status});
        setOpenStatuses(false);
    }

  return (<>
    <div className='w-full'>
      <div>
        <div>
            <input type="text" value={focusedItem.name} onChange={(e)=>setFocusedItem({...focusedItem, name: e.target.value})} className='text-lg font-semibold w-full'/>
            <div 
                className='flex flex-row justify-between p-2 w-full'
            >
                <p 
                    className='flex-flex-row w-fit p-1 cursor-pointer bg-brand_blue text-white'
                    onClick={()=>setOpenStatuses(!openStatuses)}
                >
                    <span className=''>{focusedItem.stage}</span> 
                    <span>{openStatuses?'🔽':'◀️'}</span>
                </p>
                {focusedItem._id && 
                    <button onClick={() => handleTaskAdd} className='border border-brand_green rounded-lg p-1 cursor-pointer bg-brand_blue text-white'>
                        Add Task
                    </button>}
                <p onClick={()=>setFocusedItem(null)} className='cursor-pointer'>❌</p>
            </div>
            <div className='absolute bg-brand_blue text-white border-b-1 border-gray-300 shadow-lg rounded-md z-10'>
              {openStatuses && 
                  project.workflowStatuses?.map(status=>(
                      <li key={status} className='list-none m-2 border-b border-b-brand_green  hover:bg-gray-300 cursor-pointer w-32' onClick={()=>handleUpdateStage(status)}>
                          {status}
                      </li>
                  ))}
            </div>
        </div>
      </div>
      
      <em className='text-sm'>please ensure you click save after any change is made</em>
      <div className='w-full'>
        <textarea value={focusedItem.description} onChange={(e)=>setFocusedItem({...focusedItem, description: e.target.value})} className='border border-brand_green w-full min-h-[60vh]'/>
        <button 
            onClick={handleSaveScrum}
            className='bg-brand_blue text-white px-5 py-1 rounded-lg cursor-pointer'
        >
            Save
        </button>
      </div>
    </div>
  </>)
}

export default FocusedScrum
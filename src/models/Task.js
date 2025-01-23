import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String
  },
  status: { 
    type: String
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  scrum: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Scrum' 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);

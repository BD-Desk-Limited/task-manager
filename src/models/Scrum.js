import mongoose from 'mongoose';

const ScrumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project' 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stage: {
      type: String,
      default: 'to-do',
    },
    comments: [
      {
        comment: {
          type: String,
          required: true,
        },
        commenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Scrum || mongoose.model('Scrum', ScrumSchema);
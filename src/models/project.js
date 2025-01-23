import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    workflowStatuses: {
      type: [String],
      default: ['to-do', 'ongoing', 'ready for supervision', 'complete'],
      validate: {
        validator: function (statuses) {
          return statuses.every(status => typeof status === 'string');
        },
        message: 'Workflow statuses must be an array of strings.',
      },
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);

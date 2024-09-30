import mongoose from 'mongoose';

// Define the schema for each objective with a status field
const objectiveSchema = new mongoose.Schema({
  text: { type: String, required: true }, // The objective text
  done: { type: Boolean, default: false }, // Status of the objective (true if done, false if not)
});

// Define the schema for each comment
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID of the user who commented
  userName: { type: String, required: true }, // Username of the commenter
  profilePicture: { type: String, required: true }, // Profile picture URL of the commenter
  text: { type: String, required: true }, // The comment text
  createdAt: { type: Date, default: Date.now } // Timestamp for when the comment was made
});

const saAddTaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  assignee: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], 
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  status: { type: String, required: true, enum: ['Document', 'Todo', 'Ongoing', 'Done', 'Backlog'] },
  description: { type: String },
  objectives: [objectiveSchema],  // Array of objectives, each with a text and done status
  questionUpdate: { type: String },
  attachment: [{
    publicId: { type: String, required: true },
    url: { type: String, required: true },
  }],
  comments: [commentSchema],  // Array of comments
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'SaNewProject'}, 
}, { timestamps: true });

const saAddTask = mongoose.model('saAddTask', saAddTaskSchema);

export default saAddTask;

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  teamMembers: { type: String, required: true },
  adviser: { type: String, required: true },
  description: { type: String },
  image: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;

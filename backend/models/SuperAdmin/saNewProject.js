import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  thumbnail: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  },
  
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });

const Project = mongoose.model('SaNewProject', projectSchema);

export default Project;

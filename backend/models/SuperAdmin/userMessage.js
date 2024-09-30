// models/userMessage.js
import mongoose from 'mongoose';

const userMessageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    
  },
}, {
  timestamps: true, // Enable timestamps (createdAt, updatedAt)
});

const UserMessage = mongoose.model('UserMessage', userMessageSchema);
export default UserMessage;

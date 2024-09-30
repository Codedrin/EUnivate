import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: false,
  },
  sender: {
    name: { type: String, required: true },
    avatar: { type: String }, // optional avatar URL for sender
  },
  file: {
    name: { type: String, default: '' }, // file name
    type: { type: String, default: '' }, // file type
    url: { type: String, default: '' },  // file URL
  },
  time: {
    type: String,
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  replyTo: {  // Reference to another message
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage',
    default: null,
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
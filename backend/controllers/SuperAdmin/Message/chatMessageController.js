import Message from '../../../models/SuperAdmin/chatMessageModel.js';

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('replyTo');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { content, sender, file, time, replyTo } = req.body;


    const newMessage = new Message({
      content,
      sender,
      file: {
        name: file?.name || '',
        type: file?.type || '',
        url: file?.url || '',
      },
      time,
      replyTo: replyTo || null, // Assign the replyTo message ID if provided
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

// Update a message by ID
export const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { content, file, time } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { content, file, time, edited: true },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};